
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

// LEARNER ROUTE
router.get(
  "/learner",
  authMiddleware,
  authorizeRoles("LEARNER"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the Learner section",
      user: req.user,
    });
  }
);

// INSTRUCTOR ROUTE
router.get(
  "/instructor",
  authMiddleware,
  authorizeRoles("INSTRUCTOR"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the Instructor section",
      user: req.user,
    });
  }
);

// ADMIN ROUTE
router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the Admin section",
      user: req.user,
    });
  }
);

export default router;
