// routes/orderRoutes.js
import express from "express";
import { getPaidOrders, markOrderShipped } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc   Get all paid orders (Admin only)
// @route  GET /api/orders/paid
router.get("/paid", protect, adminOnly, getPaidOrders);

// @desc   Mark order as shipped & add trackingId (Admin only)
// @route  PUT /api/orders/:id/ship
router.put("/:id/ship", protect, adminOnly, markOrderShipped);

export default router;
