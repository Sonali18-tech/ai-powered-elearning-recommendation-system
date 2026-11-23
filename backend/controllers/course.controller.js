
import prisma from "../config/db.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Fetch courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses.",
    });
  }
};

