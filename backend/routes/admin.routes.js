import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import {
  getAllUsers,
  updateUserRole,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("ADMIN"));

router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);

export default router;