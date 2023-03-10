//importing depended modules
//importing depended modules
const express = require("express");
const session = require("express-session");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const validator = require("validator");
const multer = require("multer");

//requiring router modules
const userRouter = require("../router/user");
const adminRouter = require("../router/admin");

//importing connection modules
require("./db/conn");
const Register = require('../src/models/database')
// const Register = require("./models/database");

//starting the application
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//path of template
const template = path.join(__dirname, "../views");
path.join(__dirname, "../templates/partials");
const staticPath = path.join(__dirname, "../public");


//view engine setup
app.set("view engine", "ejs");
app.set("views", template);
// hbs.registerPartials(partialsPath)
app.use(express.static(staticPath));

//session management part 1
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secretpassword",
  })
);

//cache control
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

//router setup
app.use("/", userRouter);
app.use("/", adminRouter);

//session destroy
app.get("/logout", (req, res) => {
  req.session.destroy();
  console.log("session deleted");
  res.redirect("/");
  res.end();
});
app.get("/adminlogout", (req, res) => {
  req.session.destroy();
  console.log("admin session deleted");
  res.redirect("/adminlogin");
  res.end();
});




app.all("*", async (req, res) => {
  let cartDetails;
  if (req.session.user) {
    const user = await Register.findOne({ Email: req.session.user });
    cartDetails = user.cart.totalQty;
  } else {
    cartDetails = null;
  }
  if (cartDetails == 0) {
    cartDetails = null;
  }
  const currentUser = await Register.findOne({Email : req.session.user})
  res.render("404", {
    documentTitle: "404 | Page not found",
    url: req.originalUrl,
    session: req.session.userID,
    currentUser,
    cartDetails
  });
});
//port listen set up
app.listen(7000, (req, res) => {
  console.log("listening port 7000");
});
