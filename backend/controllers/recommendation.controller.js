
import prisma from "../config/db.js";

// Normalize text for matching
const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Calculate matching score for profile terms
const calculateMatchScore = (terms, courseText, weight) => {
  if (!Array.isArray(terms)) return 0;

  return terms.reduce((total, term) => {
    const normalizedTerm = normalize(term);

    if (!normalizedTerm) return total;

    if (courseText.includes(normalizedTerm)) {
      return total + weight;
    }

    const words = normalizedTerm.split(" ").filter(Boolean);

    if (words.length === 0) return total;

    const matchedWords = words.filter((word) =>
      courseText.includes(word)
    );

    return total + (matchedWords.length / words.length) * weight;
  }, 0);
};

// Generate personalized course recommendations
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch learner profile
    const profile = await prisma.learnerProfile.findUnique({
      where: { userId },
    });

    // Fetch existing enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true },
    });

    const enrolledCourseIds = new Set(
      enrollments.map((item) => item.courseId)
    );

    // Fetch all learner interactions
    const interactions = await prisma.interaction.findMany({
      where: { userId },
      include: { course: true },
    });

    // Exclude dismissed courses
    const dismissedCourseIds = new Set(
      interactions
        .filter((item) => item.eventType === "DISMISS")
        .map((item) => item.courseId)
    );

    // Find courses the learner likes
    const likedCourses = interactions
      .filter((item) => item.eventType === "LIKE")
      .map((item) => item.course);

    // Fetch available courses
    const courses = await prisma.course.findMany({
      where: {
        id: {
          notIn: [
            ...enrolledCourseIds,
            ...dismissedCourseIds,
          ],
        },
      },
    });

    // Calculate personalized scores
    const rankedCourses = courses.map((course) => {
      const courseText = normalize([
        course.title,
        course.description,
        course.category,
        ...(course.tags || []),
        ...(course.prerequisites || []),
      ].join(" "));

      let score = 0;
      const reasons = [];

      // Interests: highest weight
      const interestScore = calculateMatchScore(
        profile?.interests || [],
        courseText,
        5
      );

      if (interestScore > 0) {
        score += interestScore;
        reasons.push("Matches your interests");
      }

      // Skills
      const skillScore = calculateMatchScore(
        profile?.skills || [],
        courseText,
        3
      );

      if (skillScore > 0) {
        score += skillScore;
        reasons.push("Related to your skills");
      }

      // Learning goals
      const goalScore = calculateMatchScore(
        profile?.goals || [],
        courseText,
        4
      );

      if (goalScore > 0) {
        score += goalScore;
        reasons.push("Supports your learning goals");
      }

      // Educational background
      const educationScore = calculateMatchScore(
        profile?.education ? [profile.education] : [],
        courseText,
        1
      );

      score += educationScore;

      // Learn from previously liked courses
      likedCourses.forEach((likedCourse) => {
        if (likedCourse.category === course.category) {
          score += 2;
        }

        const likedTags = likedCourse.tags || [];
        const courseTags = course.tags || [];

        const commonTags = likedTags.filter((tag) =>
          courseTags.some(
            (courseTag) =>
              normalize(courseTag) === normalize(tag)
          )
        );

        score += Math.min(commonTags.length, 2);
      });

      // Small signal from previously viewed categories
      const viewedCourses = interactions.filter(
        (item) => item.eventType === "VIEW"
      );

      const viewedSameCategory = viewedCourses.some(
        (item) => item.course?.category === course.category
      );

      if (viewedSameCategory) {
        score += 0.5;
      }

      return {
        course,
        score: Number(score.toFixed(2)),
        reason: reasons.length
          ? reasons.join(", ")
          : "Suggested based on your available learning data",
      };
    });

    // Highest-scoring courses first
    rankedCourses.sort((a, b) => b.score - a.score);

    const topRecommendations = rankedCourses.slice(0, 5);

    // Replace previous recommendations with fresh results
    await prisma.$transaction(async (tx) => {
      await tx.recommendation.deleteMany({
        where: { userId },
      });

      if (topRecommendations.length > 0) {
        await tx.recommendation.createMany({
          data: topRecommendations.map((item) => ({
            userId,
            courseId: item.course.id,
            rankScore: item.score,
            feedback: item.reason,
          })),
        });
      }
    });

    // Return saved recommendations with course details
    const recommendations = await prisma.recommendation.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { rankScore: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate recommendations.",
    });
  }
};
