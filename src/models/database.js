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
});

const Register = new mongoose.model("detailsofusers", user);
module.exports = Register;
module.exports.details = user;
