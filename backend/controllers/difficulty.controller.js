
import prisma from "../config/db.js";

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

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

const getFeatures = ({
  profile,
  course,
  enrollments,
  interactions,
}) => {
  const courseText = normalize([
    course.title,
    course.description,
    course.category,
    ...(course.tags || []),
    ...(course.prerequisites || []),
  ].join(" "));

  const countMatches = (terms = []) =>
    terms.filter((term) => {
      const normalized = normalize(term);
      return normalized && courseText.includes(normalized);
    }).length;

  const completed = enrollments.filter(
    (item) => item.status === "COMPLETED"
  );

  const completionRate = enrollments.length
    ? completed.length / enrollments.length
    : 0;

  const quizScores = interactions
    .filter(
      (item) =>
        item.eventType === "QUIZ" &&
        typeof item.score === "number"
    )
    .map((item) => item.score);

  const averageQuizScore = quizScores.length
    ? quizScores.reduce((sum, score) => sum + score, 0) /
      quizScores.length
    : 0;

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
    completion_rate: completionRate,
    avg_quiz_score: Math.min(100, Math.max(0, averageQuizScore)),
    course_duration: course.duration || 0,
    prerequisite_count: course.prerequisites?.length || 0,
    tag_count: course.tags?.length || 0,
    course_difficulty_code:
      difficultyCodes[course.difficulty] || 1,
  };
};

// Generate difficulty predictions for the learner's courses
export const predictMyCourseDifficulty = async (req, res) => {
  try {
    const userId = req.user.id;

    const [profile, courses, enrollments, interactions] =
      await Promise.all([
        prisma.learnerProfile.findUnique({
          where: { userId },
        }),

        prisma.course.findMany(),

        prisma.enrollment.findMany({
          where: { userId },
        }),

        prisma.interaction.findMany({
          where: { userId },
        }),
      ]);

    if (!courses.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        predictions: [],
      });
    }

    const predictions = [];

    for (const course of courses) {
      const features = getFeatures({
        profile,
        course,
        enrollments,
        interactions,
      });

      const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(features),
        signal: AbortSignal.timeout(15000),
      });

      if (!mlResponse.ok) {
        const details = await mlResponse.json().catch(() => ({}));

        throw new Error(
          details.message || "ML service prediction failed."
        );
      }

      const result = await mlResponse.json();

      // Save prediction in PostgreSQL
      const existing = await prisma.difficultyPrediction.findFirst({
        where: {
          userId,
          courseId: course.id,
        },
      });

      const data = {
        predictedLevel: result.predicted_level,
        predictedScore: result.confidence,
        modelVersion: result.model_version,
      };

      const saved = existing
        ? await prisma.difficultyPrediction.update({
            where: { id: existing.id },
            data,
          })
        : await prisma.difficultyPrediction.create({
            data: {
              userId,
              courseId: course.id,
              ...data,
            },
          });

      predictions.push({
        ...saved,
        course,
      });
    }

    // Save the model's training evaluation in ModelRun once per version
    const metricsResponse = await fetch(`${ML_SERVICE_URL}/metrics`, {
      signal: AbortSignal.timeout(10000),
    });

    if (metricsResponse.ok) {
      const metrics = await metricsResponse.json();

      const existingRun = await prisma.modelRun.findFirst({
        where: {
          modelType: "DIFFICULTY_FIT",
          version: metrics.model_version,
        },
      });

      if (!existingRun) {
        await prisma.modelRun.create({
          data: {
            modelType: "DIFFICULTY_FIT",
            version: metrics.model_version,
            metrics,
            status: "COMPLETED",
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: predictions.length,
      predictions,
    });
  } catch (error) {
    console.error("Difficulty prediction error:", error);

    return res.status(503).json({
      success: false,
      message:
        error.name === "TimeoutError"
          ? "ML service timed out. Please try again."
          : "Unable to generate difficulty predictions.",
    });
  }
};

// Retrieve previously saved predictions
export const getMyDifficultyPredictions = async (req, res) => {
  try {
    const predictions = await prisma.difficultyPrediction.findMany({
      where: { userId: req.user.id },
      include: { course: true },
      orderBy: { generatedAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: predictions.length,
      predictions,
    });
  } catch (error) {
    console.error("Fetch difficulty predictions error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch difficulty predictions.",
    });
  }
};

// Read training metrics
export const getDifficultyModelMetrics = async (req, res) => {
  try {
    const metrics = await prisma.modelRun.findMany({
      where: { modelType: "DIFFICULTY_FIT" },
      orderBy: { trainedAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: metrics.length,
      metrics,
    });
  } catch (error) {
    console.error("Fetch model metrics error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch model metrics.",
    });
  }
};

