const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "detailsofusers",
  },
  products: [{ type: mongoose.Types.ObjectId, ref: "productDetails" }],
});

const wishlist = new mongoose.model("wishlist", wishlistSchema);
module.exports = wishlist;
