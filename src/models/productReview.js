const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "detailsofusers",
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "productDetails",
  },
  rating: Number,
  review: String,
  like: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
const review = new mongoose.model("review", reviewSchema);
module.exports = review;
