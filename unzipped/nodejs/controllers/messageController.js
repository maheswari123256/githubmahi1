const Message = require("../models/Message");

// Send a message
exports.sendMessage = async (req, res) => {
  const { receiver, text, orderId } = req.body;

  if (!text || !receiver) {
    return res.status(400).json({ message: "❌ Text and receiver are required" });
  }

  try {
    const message = new Message({
      sender: req.user.id,
      receiver,
      text,
      orderId,
    });

    await message.save();
    res.status(201).json({ message: "✅ Message sent", data: message });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to send message", error: err.message });
  }
};

// Get chat between two users
exports.getChat = async (req, res) => {
  const { otherUserId } = req.params;

  try {
    const chat = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch chat", error: err.message });
  }
};
