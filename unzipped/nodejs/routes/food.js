const express = require("express");
const router = express.Router();
const {
  createFood,
  getAllFoods,
  getFoodById,
  updateFood,
  deleteFood
} = require("../controllers/foodController");

// All endpoints for food
router.post("/", createFood);         // Create
router.get("/", getAllFoods);         // Read all
router.get("/:id", getFoodById);      // Read one
router.put("/:id", updateFood);       // Update
router.delete("/:id", deleteFood);    // Delete

module.exports = router;
