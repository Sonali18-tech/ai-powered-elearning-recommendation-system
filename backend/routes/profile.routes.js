
import express from "express";
import prisma from "../config/db.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

// All profile routes require learner authentication
router.use(authMiddleware, authorizeRoles("LEARNER"));

// GET learner profile
router.get("/", async (req, res) => {
  try {
    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: req.user.id },
    });

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch learner profile.",
    });
  }
});

// CREATE or UPDATE learner profile
router.put("/", async (req, res) => {
  try {
    const { education, skills, interests, goals } = req.body;

    const isValidArray = (value) =>
      value === undefined ||
      (Array.isArray(value) &&
        value.every(
          (item) => typeof item === "string" && item.trim().length > 0
        ));

    if (
      (education !== undefined && typeof education !== "string") ||
      !isValidArray(skills) ||
      !isValidArray(interests) ||
      !isValidArray(goals)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid learner profile data.",
      });
    }

    const profile = await prisma.learnerProfile.upsert({
      where: { userId: req.user.id },
      update: {
        ...(education !== undefined && { education: education.trim() }),
        ...(skills !== undefined && {
          skills: skills.map((item) => item.trim()),
        }),
        ...(interests !== undefined && {
          interests: interests.map((item) => item.trim()),
        }),
        ...(goals !== undefined && {
          goals: goals.map((item) => item.trim()),
        }),
      },
      create: {
        userId: req.user.id,
        education: education?.trim() || null,
        skills: skills || [],
        interests: interests || [],
        goals: goals || [],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Learner profile saved successfully.",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to save learner profile.",
    });
  }
});

export default router;
