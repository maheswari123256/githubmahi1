const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const deliveryBoySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  address: {
    type: String,
  },

  status: {
    type: String,
    enum: ["Available", "Busy"],
    default: "Available"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

deliveryBoySchema.pre("save", async function (next) {
  // password encrypt பண்ணுறதுக்கு
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("DeliveryBoy", deliveryBoySchema);
