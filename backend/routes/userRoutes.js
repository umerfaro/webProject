import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  googleLogin,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected Routes: Only accessible by authenticated (and possibly admin) users
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

// Public Routes: Accessible by anyone
router.post("/auth", loginUser);

// Protected Routes: Only accessible by authenticated users
router.post("/logout", logoutCurrentUser);

// New Google Auth Route
router.post("/auth/google", googleLogin);

// USER ROUTES
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// ADMIN ROUTES 👇
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);

export default router;
