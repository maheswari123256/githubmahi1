const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const notifyUser = require("../utils/notifyUser");

// ✅ Register
exports.register = async (req, res) => {
  const { name, email, password, role, age } = req.body;

  try {
    if (!name || !email || !password || !age) {
      return res.status(400).json({ message: "❌ All fields (name, email, password, age) are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "❌ User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      age
    });

    await newUser.save();

    await notifyUser(newUser._id, "🎉 Welcome! You have successfully registered.");

    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Register error", error: err.message });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await notifyUser(user._id, "🔓 You have logged in successfully.");

    res.status(200).json({
      message: "✅ Login success",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Login error", error: err.message });
  }
};

// ✅ Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "❌ Email not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 1000 * 60 * 10; // 10 mins
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const resetLink = `http://localhost:5001/account.html?token=${token}&email=${email}`;

    await transporter.sendMail({
      to: email,
      subject: "🔐 Password Reset - Food Delivery App",
      html: `<p>Click to reset password: <a href="${resetLink}">${resetLink}</a></p>`
    });

    res.status(200).json({ message: "✅ Password reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: "❌ Forgot Password Error", error: err.message });
  }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, resetToken: token });
    if (!user || user.tokenExpiry < Date.now()) {
      return res.status(400).json({ message: "❌ Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "✅ Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "❌ Reset Password Error", error: err.message });
  }
};
