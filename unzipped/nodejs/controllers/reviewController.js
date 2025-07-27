const Review = require("../models/Review");

// ✅ Create Review
exports.createReview = async (req, res) => {
try {
const review = new Review({
user: req.user.id,
food: req.body.food,
rating: req.body.rating,
comment: req.body.comment,
approved: false
});
await review.save();
res.status(201).json({ message: "✅ Review created", review });
} catch (err) {
res.status(500).json({ message: "❌ Error creating review", error: err.message });
}
};

// ✅ Get all reviews for a food (approved only)
exports.getReviewsByFood = async (req, res) => {
try {
const reviews = await Review.find({ food: req.params.foodId, approved: true })
.populate("user", "name");
res.status(200).json(reviews);
} catch (err) {
res.status(500).json({ message: "❌ Error fetching reviews", error: err.message });
}
};

// ✅ Approve Review
exports.approveReview = async (req, res) => {
try {
const review = await Review.findById(req.params.id);
if (!review) {
return res.status(404).json({ message: "❌ Review not found" });
}
review.approved = true;
await review.save();
res.status(200).json({ message: "✅ Review approved", review });
} catch (err) {
res.status(500).json({ message: "❌ Error approving review", error: err.message });
}
};

// ✅ Delete Review
exports.deleteReview = async (req, res) => {
try {
const review = await Review.findByIdAndDelete(req.params.id);
if (!review) {
return res.status(404).json({ message: "❌ Review not found" });
}
res.status(200).json({ message: "✅ Review deleted" });
} catch (err) {
res.status(500).json({ message: "❌ Error deleting review", error: err.message });
}
};

// ✅ Admin: Get all reviews (any status)
exports.getAllReviews = async (req, res) => {
try {
const reviews = await Review.find()
.populate("user", "name email")
.populate("food", "name");
res.status(200).json(reviews);
} catch (err) {
res.status(500).json({ message: "❌ Error fetching all reviews", error: err.message });
}
};