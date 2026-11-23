
import express from "express";
import { getRecommendations } from "../controllers/recommendation.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorizeRoles("LEARNER"),
  getRecommendations
);

export default router;

