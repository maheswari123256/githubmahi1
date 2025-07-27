const User = require("../models/User");
const Order = require("../models/Order");

// ✅ View All Users (excluding password)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "❌ Failed to fetch users",
      error: err.message,
    });
  }
};

// ✅ Assign Delivery Boy to Order (with validation & populate)
exports.assignDeliveryBoy = async (req, res) => {
  const { id } = req.params;
  const { deliveryBoy } = req.body;

  try {
    // 🔍 Validate order exists
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    // 🔍 Validate delivery boy exists & has proper role
    const deliveryUser = await User.findById(deliveryBoy);
    if (!deliveryUser || deliveryUser.role !== "DeliveryBoy") {
      return res
        .status(400)
        .json({ message: "❌ Invalid Delivery Boy ID or role" });
    }

    // ✅ Assign and save
    order.deliveryBoy = deliveryBoy;
    await order.save();

    // 🔄 Populate deliveryBoy in the updated response
    const updatedOrder = await Order.findById(order._id).populate(
      "deliveryBoy",
      "name email"
    );

    res.status(200).json({
      message: "✅ Delivery Boy assigned successfully",
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: "❌ Failed to assign delivery boy",
      error: err.message,
    });
  }
};
