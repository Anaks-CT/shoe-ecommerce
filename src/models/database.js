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

      status : {
        type : Boolean,
        default : false
      }
    },
  ],
});

const Register = new mongoose.model("detailsofusers", user);
module.exports = Register;
module.exports.details = user;
