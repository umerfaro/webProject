// import express from "express";
// const router = express.Router();
// import {
//   createCategory,
//   updateCategory,
//   removeCategory,
//   listCategory,
//   readCategory,
// } from "../controllers/categoryController.js";

// import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// router.route("/").post(authenticate, authorizeAdmin, createCategory);
// router.route("/:categoryId").put(authenticate, authorizeAdmin, updateCategory);
// router
//   .route("/:categoryId")
//   .delete(authenticate, authorizeAdmin, removeCategory);

// router.route("/categories").get(listCategory);
// router.route("/:id").get(readCategory);

// export default router;

// routes/categoryRoutes.js
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
router.route("/").post(authenticate, authorizeAdmin, createCategory);
router.route("/:categoryId").put(authenticate, authorizeAdmin, updateCategory);
router.route("/:categoryId").delete(authenticate, authorizeAdmin, removeCategory);

// Public Routes (if needed)
router.route("/categories").get(authenticate, listCategory); // Now protected to list user's categories
router.route("/:id").get(authenticate, readCategory); // Now protected to read user's category

export default router;
