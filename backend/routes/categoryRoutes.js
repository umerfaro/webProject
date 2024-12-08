import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// Protected Routes: Only accessible by authenticated (and possibly admin) users

// Create a new category
router.route("/").post(authenticate, authorizeAdmin, createCategory);

// Update a category by ID
router.route("/:categoryId").put(authenticate, authorizeAdmin, updateCategory);

// Delete a category by ID
router
  .route("/:categoryId")
  .delete(authenticate, authorizeAdmin, removeCategory);

// Public Routes: Accessible by anyone

// Get all categories (protected to list user's categories)
router.route("/categories").get(authenticate, listCategory);

// Get a specific category by ID
router.route("/:id").get(authenticate, readCategory);

export default router;
