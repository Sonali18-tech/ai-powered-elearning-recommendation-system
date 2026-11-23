
import express from "express";
import { createInteraction } from "../controllers/interaction.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("LEARNER"),
  createInteraction
);

export default router;

