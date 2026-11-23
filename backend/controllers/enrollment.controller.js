
import prisma from "../config/db.js";

// Enroll the logged-in learner in a course
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled in this course.",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: { course: true },
    });

    await prisma.interaction.create({
      data: {
        userId,
        courseId,
        eventType: "ENROLL",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Successfully enrolled.",
      enrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to enroll in this course.",
    });
  }
};

// Get all courses enrolled by the logged-in learner
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: { course: true },
      orderBy: { enrolledAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch enrolled courses.",
    });
  }
};

// Update progress for an enrolled course
export const updateEnrollmentProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const progress = Number(req.body.progress);
    const userId = req.user.id;

    if (
      req.body.progress === undefined ||
      !Number.isFinite(progress) ||
      progress < 0 ||
      progress > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress must be a number between 0 and 100.",
      });
    }

    const existing = await prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        userId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });
    }

    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress,
        status: progress === 100 ? "COMPLETED" : "ACTIVE",
      },
      include: { course: true },
    });

    // Record completion only when the course first reaches 100%
    if (existing.progress < 100 && progress === 100) {
      await prisma.interaction.create({
        data: {
          userId,
          courseId: existing.courseId,
          eventType: "COMPLETE",
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course progress updated.",
      enrollment,
    });
  } catch (error) {
    console.error("Progress update error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update course progress.",
    });
  }
};
