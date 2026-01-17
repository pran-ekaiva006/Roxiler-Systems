import express from "express";
import { submitRating, getUserRating, getStoreRatings, getAllRatings } from "../controllers/ratingsController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Normal User: Submit/update rating
router.post("/submit", authMiddleware, roleMiddleware(["normal_user"]), submitRating);

// Normal User: Get their rating for a store
router.get("/user/:store_id", authMiddleware, roleMiddleware(["normal_user"]), getUserRating);

// Store Owner: Get ratings for their store
router.get("/store/:store_id", authMiddleware, roleMiddleware(["store_owner"]), getStoreRatings);

// Admin: Get all ratings
router.get("/admin/all", authMiddleware, roleMiddleware(["admin"]), getAllRatings);

export default router;