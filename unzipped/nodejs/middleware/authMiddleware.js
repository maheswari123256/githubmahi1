const jwt = require("jsonwebtoken");

// ✅ Middleware to verify JWT token from Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ❌ If no token provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "❌ Access denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request object
    req.user = decoded;

    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ message: "❌ Invalid or expired token" });
  }
};

module.exports = verifyToken;
