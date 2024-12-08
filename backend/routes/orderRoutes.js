import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// GET /api/orders
router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

// GET /api/userorders
router.route("/mine").get(authenticate, getUserOrders);

// GET /api/orders/total-orders
router.route("/total-orders").get(countTotalOrders);

// GET /api/orders/total-sales
router.route("/total-sales").get(calculateTotalSales);

// GET /api/orders/total-sales-by-date
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);

// GET /api/orders/:id
router.route("/:id").get(authenticate, findOrderById);

// PUT /api/orders/:id/pay
router.route("/:id/pay").put(authenticate, markOrderAsPaid);

// PUT /api/orders/:id/deliver
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

export default router;
