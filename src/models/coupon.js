const mongoose = require("mongoose");
const couponSchema = mongoose.Schema({
  name: String,
  code: String,
  discount: Number,
  startingDate: Date,
  expiryDate: Date,
  active: {
    type: Boolean,
    default: true,
  },
});
const coupon = new mongoose.model('Coupon',couponSchema)
module.exports = coupon
