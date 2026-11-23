
import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  updateEnrollmentProgress,
} from "../controllers/enrollment.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("LEARNER"));

router.post("/", enrollInCourse);

router.get("/my-courses", getMyEnrollments);

router.patch("/:enrollmentId/progress", updateEnrollmentProgress);

export default router;
