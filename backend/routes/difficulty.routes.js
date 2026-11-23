
import express from "express";

import {
  predictMyCourseDifficulty,
  getMyDifficultyPredictions,
  getDifficultyModelMetrics,
} from "../controllers/difficulty.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("LEARNER"));

router.post("/predict", predictMyCourseDifficulty);

router.get("/my-predictions", getMyDifficultyPredictions);

router.get("/metrics", getDifficultyModelMetrics);

export default router;
