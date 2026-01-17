import express from "express";
import { createUser, getAllUsers, getUserById, getDashboardStats, deleteUser } from "../controllers/usersController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only routes
router.post("/", authMiddleware, roleMiddleware(["admin"]), createUser);
router.get("/admin/all", authMiddleware, roleMiddleware(["admin"]), getAllUsers);
router.get("/admin/stats", authMiddleware, roleMiddleware(["admin"]), getDashboardStats);
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), getUserById);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

export default router;