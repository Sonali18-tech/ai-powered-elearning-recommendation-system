import express from "express";
import { getAllCourses } from "../controllers/course.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

// Only authenticated learners can access the course catalog
router.get("/", authMiddleware, authorizeRoles("LEARNER"), getAllCourses);

export default router;

