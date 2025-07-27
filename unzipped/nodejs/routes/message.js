const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { sendMessage, getChat } = require("../controllers/messageController");

// Send a message
router.post("/", verifyToken, sendMessage);

// Get chat between user and delivery boy
router.get("/:otherUserId", verifyToken, getChat);

module.exports = router;
