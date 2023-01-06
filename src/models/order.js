const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "detailsofusers",
  },
  shippingAddress: {
    addressLine1: String,

    addressLine2: String,

    state: String,

    country: String,

    pin: Number,

    telephone: Number,
  },
  paidAmount: Number,

  totalAmount: Number,

  discount: Number,

  totalQty : Number,

  paymentMethod: String,

  orderDate: {
    type: Date,
    default: Date.now(),
  },

  delivaryDate: {
    type: Date,
  },

  couponCode: {
    type: mongoose.Types.ObjectId,
    ref: "Coupon",
  },

  deliveryStatus: {
    type: Boolean,
    default: false,
  },

  orderItems: [
    {
      productName: String,

      productImage: String,

      productSize: String,

      productPrice: Number,

      productQty: Number,

      totalPrice: Number,
    },
  ],
});

const order = new mongoose.model('order',orderSchema)
module.exports = order