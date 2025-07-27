const express = require("express");
const router = express.Router();
const { getAllUsers, assignDeliveryBoy } = require("../controllers/adminController");
const verifyToken = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware"); // ✅ Import before use

// ✅ Assign DeliveryBoy to Order
router.put("/orders/:id/assign", verifyToken, authorizeRoles("Admin"), assignDeliveryBoy);

// ✅ View all Users
router.get("/users", verifyToken, authorizeRoles("Admin"), getAllUsers); // Optional: Restrict to Admin only

module.exports = router;