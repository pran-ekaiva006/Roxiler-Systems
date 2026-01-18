import express from "express";
import {
  createStore,
  getAllStores,
  getStoresForUser,
  getStoreById,
  deleteStore,
} from "../controllers/storesController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only
router.post("/", authMiddleware, roleMiddleware(["admin"]), createStore);
router.get("/admin/all", authMiddleware, roleMiddleware(["admin"]), getAllStores);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteStore);

// Normal users + Store owners
router.get(
  "/user/list",
  authMiddleware,
  roleMiddleware(["normal_user", "store_owner"]),
  getStoresForUser
);

// Any logged-in user can view store by id
router.get("/:id", authMiddleware, getStoreById);

export default router;
