const razorpay = require("../config/razorpayConfig");
const crypto = require("crypto");
const Order = require("../models/Order");
const notifyUserPayment = require("../utils/notifyUser");
const DeliveryBoyModel = require("../models/DeliveryBoy");

// ✅ 1. Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { mongoOrderId } = req.body;
    const order = await Order.findById(mongoOrderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "❌ Order not found" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100, // amount in paise
      currency: "INR",
      receipt: mongoOrderId
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      message: "✅ Razorpay order created successfully",
      order: razorpayOrder,
      mongoOrderId: order._id
    });
  } catch (err) {
    console.error("❌ Razorpay Order Creation Error:", err.message);
    res.status(500).json({ success: false, message: "❌ Server error", error: err.message });
  }
};

// ✅ 2. Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      mongoOrderId,
      paymentMode
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "❌ Payment verification failed" });
    }

    const order = await Order.findById(mongoOrderId);
    if (!order) return res.status(404).json({ success: false, message: "❌ Order not found" });

    order.paymentStatus = "Paid";
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentMode = paymentMode;
    await order.save();

    // ✅ Send Notifications
    await notifyUserPayment(order.userId, "✅ Payment successful.");
    const deliveryBoy = await DeliveryBoyModel.findOne();
    if (deliveryBoy) {
      await notifyUserPayment(deliveryBoy._id, "🛵 Prepare for delivery.");
    }

    res.status(200).json({ success: true, message: "✅ Payment verified & order updated" });
  } catch (err) {
    console.error("❌ Payment Verification Error:", err.message);
    res.status(500).json({ success: false, message: "❌ Server error", error: err.message });
  }
};
