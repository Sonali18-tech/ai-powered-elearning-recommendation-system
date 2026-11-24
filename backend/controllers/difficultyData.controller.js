
import prisma from "../config/db.js";

const normalize = (value) =>
  String(value || "").toLowerCase().trim();

const educationLevel = (education) => {
  const value = normalize(education);

  if (/phd|doctorate/.test(value)) return 4;
  if (/master|m\.tech|mtech|mba|postgraduate/.test(value)) return 3;
  if (/b\.tech|btech|bachelor|graduate|degree/.test(value)) return 2;
  if (/diploma|polytechnic/.test(value)) return 1;
  if (/school|12th|10th/.test(value)) return 0;

  return 1;
};

const getFeatures = ({ profile, course, enrollments, interactions }) => {
  const courseText = normalize([
    course.title,
    course.description,
    course.category,
    ...(course.tags || []),
    ...(course.prerequisites || []),
  ].join(" "));

  const countMatches = (terms = []) =>
    terms.filter((term) => {
      const value = normalize(term);
      return value && courseText.includes(value);
    }).length;

  const completed = enrollments.filter(
    (item) => item.status === "COMPLETED"
  );

  const quizScores = interactions
    .filter(
      (item) =>
        item.eventType === "QUIZ" &&
        typeof item.score === "number"
    )
    .map((item) => item.score);

  const difficultyCodes = {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3,
  };

  return {
    education_level: educationLevel(profile?.education),
    skill_count: profile?.skills?.length || 0,
    interest_match: countMatches(profile?.interests),
    goal_match: countMatches(profile?.goals),
    completed_courses: completed.length,
    completion_rate: enrollments.length
      ? completed.length / enrollments.length
      : 0,
    avg_quiz_score: quizScores.length
      ? Math.min(
          100,
          Math.max(
            0,
            quizScores.reduce((a, b) => a + b, 0) /
              quizScores.length
          )
        )
      : 0,
    course_duration: course.duration || 0,
    prerequisite_count: course.prerequisites?.length || 0,
    tag_count: course.tags?.length || 0,
    course_difficulty_code: difficultyCodes[course.difficulty] || 1,
  };
};

const getTargetLevel = (rating, currentLevel) => {
  const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
  const currentIndex = levels.indexOf(currentLevel);

  if (currentIndex < 0) {
    throw new Error("Invalid course difficulty.");
  }

  if (rating === "TOO_EASY") {
    return levels[Math.min(2, currentIndex + 1)];
  }

  if (rating === "TOO_DIFFICULT") {
    return levels[Math.max(0, currentIndex - 1)];
  }

  return currentLevel;
};

// Learner submits course difficulty feedback
export const submitDifficultyFeedback = async (req, res) => {
  try {
    const { courseId, rating } = req.body;
    const userId = req.user.id;

    const allowedRatings = [
      "TOO_EASY",
      "JUST_RIGHT",
      "TOO_DIFFICULT",
    ];

    if (!courseId || !allowedRatings.includes(rating)) {
      return res.status(400).json({
        success: false,
        message: "Valid course ID and difficulty feedback are required.",
      });
    }

    const [course, enrollment, profile, enrollments, interactions] =
      await Promise.all([
        prisma.course.findUnique({ where: { id: courseId } }),
        prisma.enrollment.findUnique({
          where: {
            userId_courseId: { userId, courseId },
          },
        }),
        prisma.learnerProfile.findUnique({ where: { userId } }),
        prisma.enrollment.findMany({ where: { userId } }),
        prisma.interaction.findMany({ where: { userId } }),
      ]);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "Enroll in this course before submitting feedback.",
      });
    }

    const features = getFeatures({
      profile,
      course,
      enrollments,
      interactions,
    });

    const target = getTargetLevel(rating, course.difficulty);

    const feedback = await prisma.difficultyFeedback.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      update: { rating },
      create: { userId, courseId, rating },
    });

    const observation = await prisma.trainingObservation.upsert({
      where: { feedbackId: feedback.id },
      update: { features, target },
      create: {
        feedbackId: feedback.id,
        features,
        target,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Difficulty feedback recorded successfully.",
      feedback,
      observation: {
        id: observation.id,
        target: observation.target,
      },
    });
  } catch (error) {
    console.error("Difficulty feedback error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save difficulty feedback.",
    });
  }
};

// Admin: dataset statistics
export const getTrainingDatasetStats = async (req, res) => {
  try {
    const [total, grouped] = await Promise.all([
      prisma.trainingObservation.count(),
      prisma.trainingObservation.groupBy({
        by: ["target"],
        _count: { target: true },
      }),
    ]);

    return res.json({
      success: true,
      total,
      classDistribution: grouped.map((item) => ({
        target: item.target,
        count: item._count.target,
      })),
    });
  } catch (error) {
    console.error("Dataset statistics error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve dataset statistics.",
    });
  }
};

// Admin: export anonymized observations as CSV
export const exportTrainingDataset = async (req, res) => {
  try {
    const observations = await prisma.trainingObservation.findMany({
      orderBy: { createdAt: "asc" },
    });

    const columns = [
      "education_level",
      "skill_count",
      "interest_match",
      "goal_match",
      "completed_courses",
      "completion_rate",
      "avg_quiz_score",
      "course_duration",
      "prerequisite_count",
      "tag_count",
      "course_difficulty_code",
      "target",
    ];

    const escapeCsv = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = observations.map((item) => {
      const features = item.features || {};

      return [
        ...columns.slice(0, -1).map((column) => features[column]),
        item.target,
      ].map(escapeCsv).join(",");
    });

    const csv = [
      columns.join(","),
      ...rows,
    ].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="learner_training_data.csv"'
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error("Dataset export error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to export training dataset.",
    });
  }
};

