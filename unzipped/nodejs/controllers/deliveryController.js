const Order = require("../models/Order");
const User = require("../models/User");
const mongoose = require("mongoose");
const sendMail = require("../utils/sendMail");

// ✅ View Orders assigned to this delivery boy
exports.getAssignedOrders = async (req, res) => {
  try {
    const deliveryBoyId = new mongoose.Types.ObjectId(req.user.id);

    const orders = await Order.find({ deliveryBoy: deliveryBoyId })
      .populate("userId", "name email")
      .populate("items.foodId", "name price category")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: "❌ Cannot fetch assigned orders",
      error: err.message,
    });
  }
};

// ✅ Update Delivery Status (with optional email)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const deliveryBoyId = new mongoose.Types.ObjectId(req.user.id);

    const order = await Order.findOne({
      _id: req.params.id,
      deliveryBoy: deliveryBoyId,
    });

    if (!order) {
      return res.status(404).json({
        message: "❌ Order not found or not assigned to you",
      });
    }

    const validStatus = ["Out for Delivery", "Delivered"];
    if (!validStatus.includes(req.body.status)) {
      return res.status(400).json({
        message: "❌ Invalid status value",
      });
    }

    order.status = req.body.status;
    await order.save();

    // ✅ Send mail to user (optional)
    try {
      const user = await User.findById(order.userId);
      if (user?.email) {
        const subject = "📦 Order Status Update";
        const text = `Hi ${user.name || "Customer"},\n\nYour order status is now "${order.status}".\n\nThank you for ordering from us!`;
        await sendMail(user.email, subject, text);
      }
    } catch (mailErr) {
      console.log("⚠️ Mail error (ignored):", mailErr.message);
    }

    res.status(200).json({
      message: "✅ Status updated successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: "❌ Error updating status",
      error: err.message,
    });
  }
};

// ✅ View Today’s Orders
exports.getTodaysOrders = async (req, res) => {
  try {
    const deliveryBoyId = new mongoose.Types.ObjectId(req.user.id);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      deliveryBoy: deliveryBoyId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("userId", "name email")
      .populate("items.foodId", "name price category")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: "❌ Error fetching today’s orders",
      error: err.message,
    });
  }
};

// ✅ View Delivery History
exports.getDeliveryHistory = async (req, res) => {
  try {
    const deliveryBoyId = new mongoose.Types.ObjectId(req.user.id);

    const orders = await Order.find({
      deliveryBoy: deliveryBoyId,
      status: "Delivered",
    })
      .populate("userId", "name email")
      .populate("items.foodId", "name price category")
      .sort({ updatedAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: "❌ Error fetching delivery history",
      error: err.message,
    });
  }
};
