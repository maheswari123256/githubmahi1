const Order = require("../models/Order");
const Food = require("../models/Food");
const notifyUserOrder = require("../utils/notifyUser");
const DeliveryBoy = require("../models/DeliveryBoy");

// ✅ 1. Place Order
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "❌ Order items missing" });
    }

    if (
      ![
        "CreditCard",
        "DebitCard",
        "NetBanking",
        "CashOnDelivery",
        "UPI",
        "Wallet",
        "Razorpay",
      ].includes(paymentMode)
    ) {
      return res.status(400).json({ message: "❌ Invalid payment mode" });
    }

    let totalAmount = 0;
    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res
          .status(404)
          .json({ message: `❌ Food item not found: ${item.foodId}` });
      }
      totalAmount += food.price * item.quantity;
    }

    const newOrder = new Order({
      userId: req.user.id,
      items,
      deliveryAddress,
      paymentMode,
      paymentStatus: paymentMode === "CashOnDelivery" ? "Pending" : "Unpaid",
      totalAmount,
      status: "Pending",
    });

    await newOrder.save();

    // 🔔 Send Notifications
    await notifyUserOrder(req.user.id, "🛍 Order placed.");
    const firstBoy = await DeliveryBoy.findOne();
    if (firstBoy) {
      await notifyUserOrder(firstBoy._id, "📦 New order assigned.");
    }

    res
      .status(201)
      .json({ message: "✅ Order placed successfully", order: newOrder });
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error placing order", error: err.message });
  }
};

// ✅ 2. Get Latest Unpaid Order
exports.getLatestUnpaidOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const latestOrder = await Order.findOne({
      userId,
      paymentStatus: { $in: ["Pending", "Unpaid"] },
    }).sort({ createdAt: -1 });

    if (!latestOrder) {
      return res
        .status(404)
        .json({ success: false, message: "❌ No unpaid order found" });
    }

    res.status(200).json({ success: true, order: latestOrder });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "❌ Server error", error: err.message });
  }
};

// ✅ 3. Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order)
      return res
        .status(404)
        .json({ message: "❌ Order not found or not yours" });

    if (order.status === "Cancelled")
      return res
        .status(400)
        .json({ message: "⚠️ Already cancelled" });

    order.status = "Cancelled";
    await order.save();

    // 🔔 Send Notifications
    await notifyUserOrder(req.user.id, "❌ You cancelled the order.");
    if (order.deliveryBoy) {
      await notifyUserOrder(order.deliveryBoy, "❗ Order cancelled by user.");
    }

    res
      .status(200)
      .json({ message: "✅ Order cancelled successfully", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error cancelling order", error: err.message });
  }
};

// ✅ 4. Track Order
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order)
      return res.status(404).json({ message: "❌ Order not found" });

    res.status(200).json({
      message: "✅ Order status retrieved",
      status: order.status,
      orderId: order._id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error fetching order status", error: err.message });
  }
};

// ✅ 5. Get Order History
exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error fetching order history", error: err.message });
  }
};

// ✅ 6. Get All Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error fetching orders", error: err.message });
  }
};

// ✅ 7. Get Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order)
      return res.status(404).json({ message: "❌ Order not found" });

    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error fetching order", error: err.message });
  }
};
