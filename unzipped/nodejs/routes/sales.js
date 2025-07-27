const express = require("express");
const router = express.Router();
const { getSalesReport } = require("../controllers/salesController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/sales-report", verifyToken, getSalesReport);

module.exports = router;
