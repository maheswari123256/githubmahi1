const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

// ✅ JWT Protected route
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "✅ Protected route accessed",
    user: req.user, // token-la irundha user data
  });
});

module.exports = router;
