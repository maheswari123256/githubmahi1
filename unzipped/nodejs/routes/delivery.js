const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  getAssignedOrders,
  updateDeliveryStatus,
  getTodaysOrders,
  getDeliveryHistory,
} = require("../controllers/deliveryController");

const { updateProfile } = require("../controllers/profileController");

// ✅ Delivery Boy Routes
router.get("/orders", verifyToken, getAssignedOrders);           // View all assigned orders
router.put("/orders/:id", verifyToken, updateDeliveryStatus);    // Update status (Out for Delivery / Delivered)
router.get("/orders/today", verifyToken, getTodaysOrders);       // View today's orders
router.get("/history", verifyToken, getDeliveryHistory);         // View delivery history
router.put("/profile", verifyToken, updateProfile);              // Update delivery boy profile

module.exports = router;
