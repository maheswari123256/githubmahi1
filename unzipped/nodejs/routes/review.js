const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
createReview,
getReviewsByFood,
deleteReview,
approveReview,
getAllReviews
} = require("../controllers/reviewController");

// ✅ Admin: Get all reviews
router.get("/", verifyToken, authorizeRoles("Admin"), getAllReviews);

// ✅ Create review (user)
router.post("/", verifyToken, createReview);

// ✅ Get reviews for food
router.get("/:foodId", getReviewsByFood);

// ✅ Approve review
router.patch("/:id/approve", verifyToken, authorizeRoles("Admin"), approveReview);

// ✅ Delete review
router.delete("/:id", verifyToken, authorizeRoles("Admin"), deleteReview);

module.exports = router;