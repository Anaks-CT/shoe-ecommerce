const mongoose = require("mongoose");
// const validator = require('validator')
const user = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  Phone: {
    type: Number,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: [true, "email id aldready present"],
  },
  Password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  mainAddress: [
    {
      addressLine1: String,

      addressLine2: String,

      state: String,

      country: String,

      pin: Number,

      telephone: Number,

      status: {
        type: Boolean,
        default: false,
      },
    },
  ],
  wishlist: {
    type: mongoose.Types.ObjectId,
    ref: "wishlist",
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "productDetails",
        },
        quantity: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalQty: {
      type: Number,
      default: 0,
    },
  },
});

const Register = new mongoose.model("detailsofusers", user);
module.exports = Register;
module.exports.details = user;
