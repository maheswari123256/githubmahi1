const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true }, // ✅ Age added and required
  role: {
    type: String,
    enum: ["Admin", "User", "DeliveryBoy"],
    default: "User"
  },
  resetToken: String,
  tokenExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
