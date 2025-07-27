const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  trackOrder,
  getOrderHistory,
  getLatestUnpaidOrder // ✅ Import new controller
} = require("../controllers/orderController");

// ✅ Order routes
router.post("/", verifyToken, createOrder);
router.get("/history/all", verifyToken, getOrderHistory);
router.get("/:id/track", verifyToken, trackOrder);
router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrderById);
router.patch("/:id/cancel", verifyToken, cancelOrder);

// ✅ Razorpay auto-fetch unpaid order for frontend
router.get("/latest/unpaid", verifyToken, getLatestUnpaidOrder); // 👈 Add this line

module.exports = router;
