const Order = require("../models/Order");
const Food = require("../models/Food");

exports.getSalesReport = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.foodId");

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Count each food item sold
    const foodCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const foodName = item.foodId.name;
        foodCount[foodName] = (foodCount[foodName] || 0) + item.quantity;
      });
    });

    // Top selling items
    const topItems = Object.entries(foodCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, sold: count }));

    res.json({
      totalOrders,
      totalRevenue,
      topItems
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Sales report error", error: err.message });
  }
};
