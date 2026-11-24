
import express from "express";
import {
  submitDifficultyFeedback,
  getTrainingDatasetStats,
  exportTrainingDataset,
} from "../controllers/difficultyData.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

// Learner feedback
router.post(
  "/feedback",
  authMiddleware,
  authorizeRoles("LEARNER"),
  submitDifficultyFeedback
);

// Admin dataset management
router.get(
  "/stats",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getTrainingDatasetStats
);

router.get(
  "/export",
  authMiddleware,
  authorizeRoles("ADMIN"),
  exportTrainingDataset
);

export default router;

