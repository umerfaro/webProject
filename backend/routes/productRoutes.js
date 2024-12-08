import express from "express";
import formidable from "express-formidable";
const router = express.Router();

import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// Product routes start here
router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

// Product routes end here
router.route("/allproducts").get(fetchAllProducts);

// Product review routes start here
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

// Product review routes end here
router.get("/top", fetchTopProducts);

// Product new routes start here
router.get("/new", fetchNewProducts);

// Product new routes end here
router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

// Filtered products
router.route("/filtered-products").post(filterProducts);

export default router;
