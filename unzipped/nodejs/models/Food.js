const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["Veg", "Non-Veg", "Beverage","Italian"],
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String, // Image URL or filename
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Food", foodSchema);
