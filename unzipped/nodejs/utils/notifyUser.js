const Notification = require("../models/Notification");
const User = require("../models/User");

const notifyUser = async (userId, message) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const newNotification = new Notification({ userId, message });
    await newNotification.save();
  } catch (error) {
    console.error("❌ Notification error:", error.message);
  }
};

module.exports = notifyUser;