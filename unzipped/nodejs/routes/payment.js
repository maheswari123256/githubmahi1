const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { createOrder, verifyPayment } = require("../controllers/paymentController");

router.post("/create-order", verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPayment);

module.exports = router;
