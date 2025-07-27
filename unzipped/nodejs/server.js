// ✅ Load env variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Message = require("./models/Message");
const sendMail = require("./utils/sendMail");

// ✅ Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Route Imports
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/protected"));
app.use("/api/foods", require("./routes/food"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/reviews", require("./routes/review"));
app.use("/api", require("./routes/sales"));
app.use("/api/delivery", require("./routes/delivery"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/user", require("./routes/user"));
app.use("/api/messages", require("./routes/message"));
app.use("/api/payment", require("./routes/payment"));

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("✅ Server running with private Socket.IO Chat and Razorpay integration");
});

// ✅ Socket.IO User Map
const userSocketMap = new Map();

// ✅ SOCKET.IO HANDLERS
io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);

  // 🔐 Register user
  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log(`👤 Registered userId: ${userId} → socketId: ${socket.id}`);
  });

  // 💬 Handle sending message
  socket.on("sendMessage", async ({ from, to, text }) => {
    try {
      console.log(`📨 Message: ${from} ➝ ${to} | Text: ${text}`);
      const msg = new Message({ from, to, text });
      await msg.save();

      const toSocketId = userSocketMap.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit("receiveMessage", { from, text });
        console.log("📥 Message delivered to:", toSocketId);
      } else {
        console.log("⚠️ Receiver not connected:", to);
      }

      // Optional: Send email alert
      await sendMail(
        "maheshwari.r.dev@gmail.com",
        "📩 New Socket Message",
        `From: ${from}\nTo: ${to}\nMessage: ${text}`
      );
    } catch (error) {
      console.error("❌ Error in sendMessage:", error.message);
    }
  });

  // ❌ Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    for (let [userId, sockId] of userSocketMap.entries()) {
      if (sockId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`🧹 Removed mapping for userId: ${userId}`);
        break;
      }
    }
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
