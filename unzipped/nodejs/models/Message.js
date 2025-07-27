const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,
  from: String,
  to: String, // ✅ added this
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
