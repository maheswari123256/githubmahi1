const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { createUser } = require("../controllers/userController");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { updateUserEmail } = require("../controllers/userController");

// Profile
router.post("/", createUser); // ✅ POST /user
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.put("/email", verifyToken, updateUserEmail);

// Notifications
router.get("/notifications", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching notifications" });
  }
});

router.post("/notifications/:id/seen", verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { seen: true });
    res.status(200).json({ message: "✅ Notification marked as seen" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error marking as seen" });
  }
});

router.delete("/notifications/:id", verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "🗑️ Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error deleting notification" });
  }
});

// 🔁 List Receivers
router.get("/receivers", verifyToken, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select("_id name role");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching users" });
  }
});

module.exports = router;
