const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "productDetails",
  },
  image: String,
  price: Number,
  brand: String,
  description: String,
  active: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Boolean,
    default: true,
  },
});
const banner = new mongoose.model("frontBanner", bannerSchema);
module.exports = banner;
