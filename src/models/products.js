const mongoose = require("mongoose");
const product = new mongoose.Schema({
  Name: {
    type: String,
  },
  Description: {
    type: String,
  },
  Price: {
    type: Number,
  },
  Category: {
    type: String,
  },
  Color: {
    type: String,
  },
  stock : {
    small : Number,
    medium : Number,
    large : Number,
    x_large : Number,
    xx_large : Number,
    total : Number
  },
  Image1: {
    type: String,
    required: true,
  },
  Image2: {
    type: String,
  },
  Image3: {
    type: String,
  },
  Image4: {
    type: String,
  },
  Image5: {
    type: String,
  },
  Image6: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const newProduct = new mongoose.model("productDetails", product);
module.exports = newProduct;
