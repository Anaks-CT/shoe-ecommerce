const Register = require("../src/models/database");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const newProduct = require("../src/models/products");
function welcome(req, res) {
  res.render("welcome");
}

function register(req, res) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("register");
  }
}

let flag;
let otpgen;
let user;

async function postRegister(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const firstname = req.body.name;
    const Phone = req.body.phone;
    const email = req.body.email;
    const useremail = Register.findOne({ Email: email });
    const userphone = Register.findOne({ Phone: Phone });
    if (password === cpassword) {
      user = {
        firstname: firstname,
        Phone: Phone,
        Email: email,
        Password: hashedPassword,
      };

      if (email != useremail.Email) {
        if (Phone != userphone.Phone) {
          // otpgenerate
          otpgen = Math.floor(1000 + Math.random() * 9000);
          console.log(otpgen);
          // email
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "anaksthayyil30@gmail.com",
              pass: "ojuwgqbiwgjxplqf",
            },
          });
          var mailOptions = {
            from: "anaksthayyil30@gmail.com",
            to: req.body.email,
            // subject: user.firstname,
            //   text: enterotp
            html: `<p>${otpgen}</p>`,
          };
          await transporter.sendMail(mailOptions, function (error) {
            if (error) {
              console.log(error);
            } else {
              res.redirect("/signupotp");
            }
          });

          flag = 1;
        } else {
          res.render("register", { error: "Phone no. aldready taken" });
        }
      } else {
        res.render("register", { error: "Email ID aldready taken" });
      }
    } else {
      res.render("register", { error: "passwords not matching" });
    }
  } catch (error) {
    res.send("passwords not matching");
  }
}

function signupotp(req, res) {
  if (flag == 1) {
    res.render("signupotp");
  } else {
    res.render("register");
  }
}

function postsignupotp(req, res) {
  if (otpgen == req.body.otp) {
    Register.insertMany([user]);
    res.render("login");
  } else {
    res.render("signupotp", { error: "OTP entered is incorrect" });
  }
}

function login(req, res) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("login");
  }
}

async function postLogin(req, res) {
  try {
    const email = req.body.email;
    const user = await Register.findOne({ Email: email });
    if (user.active == true) {
      const comparepassword = await bcrypt.compare(
        req.body.password,
        user.Password
      );
      if (comparepassword) {
        req.session.user = email;
        res.redirect("/login2");
      } else {
        res.render("login", { error: "Invalid login details" });
      }
    } else {
      res.render("login", { error: "unauthorised user" });
    }
  } catch (error) {
    res.render("login", { error: "user not found" });
  }
}

async function userwelcome(req, res) {
  if (req.session.user) {
    res.render("userwelcome");
  } else {
    res.redirect("/");
  }
}

function userwelcome2(req, res) {
  if (req.session.user) {
    res.redirect("/accountDetails");
  } else {
    res.redirect("/login");
  }
}

function forgotPassword(req, res) {
  res.render("user-forgotPassword-email");
}

let emailCheck;
let currentEmail;
let forgotpasswordotp;
async function postforgotPassword(req, res) {
  try {
    currentEmail = req.body.email;
    emailCheck = await Register.findOne({ Email: req.body.email });
    if (emailCheck.Email == req.body.email) {
      // otpgenerate
      forgotpasswordotp = Math.floor(1000 + Math.random() * 9000);
      console.log(forgotpasswordotp);
      // email
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "anaksthayyil30@gmail.com",
          pass: "ojuwgqbiwgjxplqf",
        },
      });
      var mailOptions = {
        from: "anaksthayyil30@gmail.com",
        to: req.body.email,
        // subject: user.firstname,
        //   text: enterotp
        html: `<p>${forgotpasswordotp}</p>`,
      };
      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.redirect("/forgotPassword-OTP");
        }
      });
    } else {
      res.render("user-forgotPassword-email", {
        error: "Email not registered!!",
      });
    }
  } catch (error) {
    res.render("user-forgotPassword-email", {
      error: "Email not registered!!",
    });
  }
}

function forgotPasswordOTP(req, res) {
  res.render("user-forgotPasswordOTP");
}

function postForgotPasswordOTP(req, res) {
  if (forgotpasswordotp == req.body.otp) {
    res.redirect("/userNewPassword");
  } else {
    res.render("user-forgotPasswordOTP", { error: "OTP entered is incorrect" });
  }
}

function userNewPassword(req, res) {
  res.render("user-newPassword");
}

async function postUserNewPassword(req, res) {
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  await Register.updateOne(
    { Email: currentEmail },
    {
      $set: {
        Password: hashPassword,
      },
    }
  );
  res.redirect("/login");
}
let i;
async function setasdefault(req, res) {
  try {
    const email = req.session.user;
    // const user = await Register.findOne({ Email: email });
    i = req.query.i;
    console.log(i);
    const addressid = req.query.addressid;
    console.log(addressid);
    await Register.updateMany(
      { Email: email, "mainAddress.status": true },
      {
        $set: {
          "mainAddress.$.status": false,
        },
      }
    );
    await Register.updateOne(
      { Email: email, "mainAddress._id": addressid },
      {
        $set: {
          "mainAddress.$.status": true,
        },
      }
    );
    res.redirect("/userAddress");
  } catch (error) {
    console.log(error);
  }
}
async function accountDetails(req, res) {
  if (req.session.user) {
    const email = req.session.user;
    const userDetails = await Register.findOne({ Email: email });
    const mainAddress = userDetails.mainAddress[i];
    console.log(mainAddress);
    console.log(i);
    res.render("user-accountDetails", { userDetails, mainAddress });
  } else {
    res.render("login");
  }
}
async function userAddress(req, res) {
  const email = req.session.user;
  const userDetails = await Register.findOne({ Email: email });
  const mainAddress = userDetails.mainAddress;
  res.render("user-address", { mainAddress });
}

async function addAddress(req, res) {
  res.render("user-addAddress");
}

async function postAddAddress(req, res) {
  const email = req.session.user;
  await Register.updateOne(
    { Email: email },
    {
      $push: {
        mainAddress: {
          addressLine1: req.body.addressline1,
          addressLine2: req.body.addressline2,
          state: req.body.state,
          country: req.body.Country,
          pin: req.body.pin,
          telephone: req.body.Phone,
        },
      },
    }
  );
  res.redirect("/userAddress");
}

let id;
async function editAddress(req, res) {
  try {
    const email = req.session.user;
    id = req.query.id;
    const userDetails = await Register.findOne({ Email: email });
    const mainAddress = userDetails.mainAddress[id];
    res.render("user-editAddress", { mainAddress });
  } catch (error) {
    console.log(error);
  }
}

async function postEditAddress(req, res) {
  const email = req.session.user;
  const id = req.query.idd;
  await Register.updateOne(
    { Email: email, "mainAddress._id": id },
    {
      $set: {
        "mainAddress.$.addressLine1": req.body.addressline1,
        "mainAddress.$.addressLine2": req.body.addressline2,
        "mainAddress.$.state": req.body.state,
        "mainAddress.$.country": req.body.Country,
        "mainAddress.$.pin": req.body.pin,
        "mainAddress.$.telephone": req.body.Phone,
      },
    }
  );
  res.redirect("/userAddress");
}

async function deleteAddress(req, res) {
  const email = req.session.user;
  const user = await Register.findOne({ Email: email });
  const i = req.query.i;
  await Register.updateOne(
    { Email: email },
    {
      $pull: {
        mainAddress: {
          addressLine1: user.mainAddress[i].addressLine1,
          addressLine2: user.mainAddress[i].addressLine2,
          state: user.mainAddress[i].state,
          country: user.mainAddress[i].country,
          pin: user.mainAddress[i].pin,
          telephone: user.mainAddress[i].telephone,
        },
      },
    }
  );
  console.log("dfdsf");
  res.redirect("/userAddress");
}

async function men(req, res) {
  if (req.session.user) {
    const email = req.session.user;
    const userDetails = await Register.findOne({ Email: email });
    // const now = userDetails.cart.items[0].productId
    // console.log(userDetails.cart.items[0].productId);
    const product = userDetails.cart.items;
    // const details = await Register.aggregate([{$match : {Email:email}},{$project:{id:"$cart.items.productId"}},{$group:{_id:{id:"$id"}}},{$unwind:"$id"}])
    // const details = await Register.aggregate([{$match : {Email:email}},{$project:{id:"$cart.items.productId"}},{$group:{_id:{id:"$id"}}}])
    // console.log(details);
    const fullProducts = await newProduct.find({});
    const productDetails1 = await newProduct.find({ Category: "Men" }).limit(6);
    const productDetails2 = await newProduct
      .find({ Category: "Men" })
      .skip(6)
      .limit(6);
    const productDetails3 = await newProduct.find({ Category: "Men" }).skip(12);
    res.render("men", {
      productDetails1,
      productDetails2,
      productDetails3,
      fullProducts,
      product,
    });
  } else {
    const productDetails1 = await newProduct.find({ Category: "Men" }).limit(6);
    const productDetails2 = await newProduct
      .find({ Category: "Men" })
      .skip(6)
      .limit(6);
    const productDetails3 = await newProduct.find({ Category: "Men" }).skip(12);
    res.render("men", { productDetails1, productDetails2, productDetails3 });
  }
}

async function women(req, res) {
  const productDetails1 = await newProduct.find({ Category: "Women" }).limit(6);
  const productDetails2 = await newProduct
    .find({ Category: "Women" })
    .skip(6)
    .limit(6);
  const productDetails3 = await newProduct.find({ Category: "Women" }).skip(12);
  res.render("women", { productDetails1, productDetails2, productDetails3 });
}
function cart(req, res) {
  res.render("user-cart");
}

async function addToCart(req, res) {
  if (req.session.user) {
    const email = req.session.user;
    const id = req.query.id;
    const productDetails = await newProduct.findOne({ _id: id });
    const user = await Register.findOne({ Email: email });
    console.log(user.cart.totalQty);
    // const details = await Register.aggregate([{$match : {Email:email}},{$project:{id:"$cart.items.productId"}},{$unwind:"$id"},{$match:{id:id}}])
    const details = await Register.aggregate([
      { $match: { Email: email } },
      { $project: { id: "$cart.items.productId" } },
      { $unwind: "$id" },
    ]);
    // console.log(details[0]._id.id[1]);
    // console.log(details[0].id);
    let flag;
    if (user.cart.totalQty == 0) {
      console.log("entered first if condition");
      await Register.updateOne(
        { Email: email },
        {
          $push: {
            "cart.items": {
              productId: id,
              quantity: 1,
              price: productDetails.Price,
            },
          },
          $inc: {
            "cart.totalPrice": productDetails.Price,
            "cart.totalQty": 1,
          },
        }
      );
      res.redirect("/men");
    } else {
      console.log(id);
      console.log("entered first else condition");
      for (let i = 0; i < user.cart.totalQty; i++) {
        // console.log(details[i].id);
        let detailsID = await new String(details[i].id).trim();
        console.log(detailsID);
        console.log(i);
        if (detailsID == id) {
          flag = i;
          break;
        } else {
          flag = 14545;
        }
      }
      if (flag == 14545) {
        console.log("entered if condition inside first else");
        await Register.updateOne(
          { Email: email },
          {
            $push: {
              "cart.items": {
                productId: id,
                quantity: 1,
                price: productDetails.Price,
              },
            },
            $inc: {
              "cart.totalPrice": productDetails.Price,
              "cart.totalQty": 1,
            },
          }
        );
        res.redirect("/men");
      } else {
        console.log("entered elseif condition inside first else");
        await Register.updateMany(
          {
            Email: email,
            "cart.items": {
              $elemMatch: {
                productId: id,
              },
            },
          },
          {
            $inc: {
              "cart.totalPrice": productDetails.Price,
              "cart.totalQty": 1,
              "cart.items.$.quantity": 1,
              "cart.items.$.price": productDetails.Price,
            },
          }
        );
        res.redirect("/men");
      }
    }
  } else {
    res.redirect("/login");
  }
}

module.exports = {
  welcome,
  register,
  postRegister,
  login,
  postLogin,
  userwelcome,
  userwelcome2,
  signupotp,
  postsignupotp,
  accountDetails,
  forgotPassword,
  postforgotPassword,
  forgotPasswordOTP,
  postForgotPasswordOTP,
  userNewPassword,
  postUserNewPassword,
  userAddress,
  addAddress,
  postAddAddress,
  editAddress,
  postEditAddress,
  deleteAddress,
  setasdefault,
  men,
  women,
  cart,
  addToCart,
};
