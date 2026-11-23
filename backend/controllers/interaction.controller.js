
import prisma from "../config/db.js";

const allowedEvents = ["VIEW", "LIKE", "DISMISS", "QUIZ"];

export const createInteraction = async (req, res) => {
  try {
    const { courseId, eventType, duration, score } = req.body;
    const userId = req.user.id;

    if (!courseId || !eventType) {
      return res.status(400).json({
        success: false,
        message: "Course ID and event type are required.",
      });
    }

    if (!allowedEvents.includes(eventType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interaction type.",
      });
    }

    if (
      duration !== undefined &&
      (!Number.isInteger(duration) || duration < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a non-negative integer.",
      });
    }

    if (
      score !== undefined &&
      (typeof score !== "number" || !Number.isFinite(score))
    ) {
      return res.status(400).json({
        success: false,
        message: "Score must be a valid number.",
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

    const interaction = await prisma.interaction.create({
      data: {
        userId,
        courseId,
        eventType,
        ...(duration !== undefined && { duration }),
        ...(score !== undefined && { score }),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Interaction recorded.",
      interaction,
    });
  } catch (error) {
    console.error("Interaction error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to record interaction.",
    });
  }
};
