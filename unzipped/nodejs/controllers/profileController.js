const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ View Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching profile", error: err.message });
  }
};

// ✅ Update Profile (name, email, password)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.status(200).json({ message: "✅ Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating profile", error: err.message });
  }
};
