const User = require("../models/User");

// ✅ 1. Create New User (without password)
exports.createUser = async (req, res) => {
  try {
    const { name, email, age, role } = req.body;

    // Basic validation
    if (!name || !email || !age) {
      return res.status(400).json({ message: "❌ Name, email, and age are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "⚠️ User with this email already exists" });
    }

    // Password will be added later via registration (authController)
    const newUser = new User({
      name,
      email,
      age,
      role: role || "User", // default role
      password: "dummy_temp_password" // 👈 required just to pass validation, will be overwritten
    });

    await newUser.save();

    // Remove dummy password from response
    newUser.password = undefined;

    res.status(201).json({ message: "✅ User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to create user", error: err.message });
  }
};

// ✅ 2. Update Email Only
exports.updateUserEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "❌ Email is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    user.email = email;
    await user.save();

    res.status(200).json({ message: "✅ Email updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to update email", error: err.message });
  }
};
