const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      }
    }
  ],
  deliveryAddress: {
    type: String,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ["CreditCard", "DebitCard", "NetBanking", "UPI", "Wallet", "CashOnDelivery", "Razorpay", "Unknown"],
    default: "Unknown"
  },
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Paid", "Pending"],
    default: "Pending"
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
