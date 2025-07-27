const Food = require("../models/Food");

// Add new food item
exports.createFood = async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (err) {
    res.status(400).json({ message: "❌ Error adding food", error: err.message });
  }
};

// Get all food items
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching foods", error: err.message });
  }
};

// Get single food item
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "❌ Food not found" });
    res.status(200).json(food);
  } catch (err) {
    res.status(500).json({ message: "❌ Error", error: err.message });
  }
};

// Update food item
exports.updateFood = async (req, res) => {
  try {
    const updated = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "❌ Error updating", error: err.message });
  }
};

// Delete food item
exports.deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "✅ Food deleted" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error deleting", error: err.message });
  }
};
