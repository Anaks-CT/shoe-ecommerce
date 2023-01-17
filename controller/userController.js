const Register = require("../src/models/database");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const newProduct = require("../src/models/products");
const newCategory = require("../src/models/category");
const wishlist = require("../src/models/wishlist");
const mongoose = require("mongoose");
const coupon = require("../src/models/coupon");
const order = require("../src/models/order");
const moment = require("moment");
const banner = require("../src/models/banner");
const review = require("../src/models/productReview");
// const sweetAlert = require("sweetalert");

async function welcome(req, res) {
  try {
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
    const product = await newProduct.find({ active: true });
    console.log(product.length);
    const length = product.length;
    const product2 = await newProduct.find({ active: true }).skip(6);
    const product3 = await newProduct.find({ active: true }).skip(12);
    const bannerProducts = await banner
      .findOne({ active: true })
      .populate("product");
    res.render("welcome", {
      cartDetails,
      length,
      product,
      product2,
      product3,
      bannerProducts,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/500/ErrorPage");
  }
}

async function register(req, res) {
  try {
    let cartDetails = null;
    res.render("register", { cartDetails });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
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
    const email = req.body.email.toLowerCase();
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
          res.render("register", {
            error: "Phone no. aldready taken",
            cartDetails,
          });
        }
      } else {
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
        res.render("register", {
          error: "Email ID aldready taken",
          cartDetails,
        });
      }
    } else {
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
      res.render("register", { error: "passwords not matching", cartDetails });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function signupotp(req, res) {
  try {
    if (flag == 1) {
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
      res.render("signupotp", { cartDetails });
    } else {
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
      res.render("register", { cartDetails });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function postsignupotp(req, res) {
  try {
    if (otpgen == req.body.otp) {
      Register.insertMany([user]);
      res.redirect("/login");
      const User = await Register.findOne({ Email: user.Email });
      const userWishlist = new wishlist({
        userId: User._id,
      });
      await userWishlist.save();
      await Register.findByIdAndUpdate(User._id, {
        $set: {
          wishlist: userWishlist._id,
        },
      });
    } else {
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
      res.render("signupotp", {
        error: "OTP entered is incorrect",
        cartDetails,
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function login(req, res) {
  try {
    if (req.session.user) {
      res.redirect("/");
    } else {
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
      console.log(cartDetails);
      res.render("login", { cartDetails });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function postLogin(req, res) {
  try {
    const email = req.body.email.toLowerCase();
    const user = await Register.findOne({ Email: email });
    if (user.active == true) {
      const comparepassword = await bcrypt.compare(
        req.body.password,
        user.Password
      );
      if (comparepassword) {
        req.session.user = email;
        res.redirect("/");
      } else {
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
        res.render("login", { error: "Invalid login details", cartDetails });
      }
    } else {
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
      res.render("login", { error: "unauthorised user", cartDetails });
    }
  } catch (error) {
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
    res.render("login", { error: "user not found", cartDetails });
  }
}

async function userwelcome(req, res) {
  try {
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
    res.render("userwelcome", { cartDetails });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

function userwelcome2(req, res) {
  try {
    if (req.session.user) {
      res.redirect("/accountDetails");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function forgotPassword(req, res) {
  try {
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
    res.render("user-forgotPassword-email", { cartDetails });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
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
      res.render("user-forgotPassword-email", {
        error: "Email not registered!!",
        cartDetails,
      });
    }
  } catch (error) {
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
    res.render("user-forgotPassword-email", {
      error: "Email not registered!!",
      cartDetails,
    });
  }
}

async function forgotPasswordOTP(req, res) {
  try {
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
    res.render("user-forgotPasswordOTP", { cartDetails });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function postForgotPasswordOTP(req, res) {
  try {
    if (forgotpasswordotp == req.body.otp) {
      res.redirect("/userNewPassword");
    } else {
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
      res.render("user-forgotPasswordOTP", {
        error: "OTP entered is incorrect",
        cartDetails,
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function userNewPassword(req, res) {
  try {
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
    res.render("user-newPassword", { cartDetails });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function postUserNewPassword(req, res) {
  try {
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
let i;
async function setasdefault(req, res) {
  try {
    const email = req.session.user;
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
    res.redirect("/500/ErrorPage");
  }
}
async function accountDetails(req, res) {
  try {
    if (req.session.user) {
      const email = req.session.user;
      const userDetails = await Register.findOne({ Email: email });
      const address = await Register.aggregate([
        {
          $match: {
            Email: email,
          },
        },
        {
          $unwind: "$mainAddress",
        },
        {
          $match: {
            "mainAddress.status": true,
          },
        },
      ]);
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
      res.render("user-accountDetails", {
        userDetails,
        cartDetails,
        address,
      });
    } else {
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
      res.render("login", { cartDetails });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function userAddress(req, res) {
  try {
    const email = req.session.user;
    const userDetails = await Register.findOne({ Email: email });
    const mainAddress = userDetails.mainAddress;
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
    res.render("user-address", { mainAddress, cartDetails });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function addAddress(req, res) {
  try {
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
    res.render("user-addAddress", { cartDetails });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function postAddAddress(req, res) {
  try {
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

let id;
async function editAddress(req, res) {
  try {
    const email = req.session.user;
    id = req.query.id;
    const userDetails = await Register.findOne({ Email: email });
    const mainAddress = userDetails.mainAddress[id];
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

    res.render("user-editAddress", { mainAddress, cartDetails });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function postEditAddress(req, res) {
  try {
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
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function deleteAddress(req, res) {
  try {
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
    res.redirect("/userAddress");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function men(req, res) {
  try {
    const productDetails = await newProduct.find({
      Category: "Men",
      active: true,
    });

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
    res.render("men", {
      productDetails,
      cartDetails,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function women(req, res) {
  try {
    const productDetails = await newProduct.find({
      Category: "Women",
      active: true,
    });
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
    res.render("women", {
      productDetails,
      cartDetails,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function cart(req, res) {
  try {
    const productcheck = await Register.find({
      Email: req.session.user,
      active: true,
    }).populate("cart.items.productId");
    // console.log(productcheck[0].cart);

    for (let i = 0; i < productcheck[0].cart.items.length; i++) {
      if (productcheck[0].cart.items[i].productId.active == false) {
        const current = await Register.updateOne(
          { Email: req.session.user },
          {
            $inc: {
              "cart.totalPrice": -productcheck[0].cart.items[i].price,
              "cart.totalQty": -productcheck[0].cart.items[i].quantity,
            },
          }
        );
        await Register.updateOne(
          { Email: req.session.user },
          {
            $pull: {
              "cart.items": {
                productId: productcheck[0].cart.items[i].productId,
                quantity: productcheck[0].cart.items[i].quantity,
                price: productcheck[0].cart.items[i].price,
              },
            },
          }
        );
        console.log(current);
      }
    }
    const email = req.session.user;
    const user = await Register.findOne({ Email: email });
    const totalPrice = user.cart;
    const data = await user.populate("cart.items.productId");
    const itemQty = data.cart.totalQty;
    const product = data.cart.items;
    let cartDetails;
    if (req.session.user) {
      const User = await Register.findOne({ Email: req.session.user });
      cartDetails = User.cart.totalQty;
    } else {
      cartDetails = null;
    }
    if (cartDetails == 0) {
      cartDetails = null;
    }
    res.render("user-cart", { product, cartDetails, totalPrice, itemQty });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function addToCart(req, res) {
  try {
    if (req.session.user) {
      const email = req.session.user;
      const id = req.query.id;
      const value = req.query.size;
      console.log(typeof value);
      const productDetails = await newProduct.findOne({
        _id: id,
        active: true,
      });
      const user = await Register.findOne({ Email: email });
      const details = await Register.aggregate([
        { $match: { Email: email } },
        { $project: { id: "$cart.items.productId" } },
        { $unwind: "$id" },
      ]);
      const sizeDetails = await Register.aggregate([
        { $match: { Email: email } },
        { $project: { size: "$cart.items.size" } },
        { $unwind: "$size" },
      ]);
      console.log(details);
      console.log(sizeDetails.size);
      let size;
      if (req.query.size == "size=L") {
        size = "Large";
      } else if (req.query.size == "size=S") {
        size = "Small";
      } else if (req.query.size == "size=M") {
        size = "Medium";
      } else if (req.query.size == "size=XL") {
        size = "X-Large";
      } else if (req.query.size == "size=XXL") {
        size = "XX-Large";
      } else {
        size = "Large";
      }
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
                size: size,
              },
            },
            $inc: {
              "cart.totalPrice": productDetails.Price,
              "cart.totalQty": 1,
            },
          }
        );
        const currentUser = await Register.findOne({ Email: req.session.user });
        const count = currentUser.cart.totalQty;
        const itemInCartCheck = await Register.findOne({
          Email: email,
          "cart.items": { $elemMatch: { productId: id } },
        });
        res.json({ status: count, data: itemInCartCheck });
      } else {
        for (let i = 0; i < user.cart.items.length; i++) {
          let detailsID = new String(details[i].id).trim();

          if (detailsID == id && sizeDetails[i].size == size) {
            flag = i;
            break;
          } else {
            flag = 14545;
          }
        }

        if (flag == 14545) {
          await Register.updateOne(
            { Email: email },
            {
              $push: {
                "cart.items": {
                  productId: id,
                  quantity: 1,
                  price: productDetails.Price,
                  size: size,
                },
              },
              $inc: {
                "cart.totalPrice": productDetails.Price,
                "cart.totalQty": 1,
              },
            }
          );
          const currentUser = await Register.findOne({
            Email: req.session.user,
          });
          const count = currentUser.cart.totalQty;
          const data = await user.populate("cart.items.productId");
          const product = data.cart.items;
          const itemInCartCheck = await Register.findOne({
            Email: email,
            "cart.items": { $elemMatch: { productId: id } },
          });
          res.json({ status: count, product: product, data: itemInCartCheck });
        } else {
          await Register.updateMany(
            {
              Email: email,
              "cart.items": {
                $elemMatch: {
                  productId: id,
                  size: size,
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
          const currentUser = await Register.findOne({
            Email: req.session.user,
          });
          const currentProduct = await Register.aggregate([
            { $match: { Email: email } },
            {
              $project: {
                qty: "$cart.items.quantity",
                price: "$cart.items.price",
              },
            },
            { $unwind: "$qty,price" },
            { $match: { "productId._id": id } },
          ]);
          console.log(currentProduct);
          const count = currentUser.cart.totalQty;
          const itemInCartCheck = await Register.findOne({
            Email: email,
            "cart.items": { $elemMatch: { productId: id } },
          });
          res.json({ status: count, data: itemInCartCheck });
        }
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function deleteCartItem(req, res) {
  try {
    if (req.session.user) {
      const email = req.session.user;
      const user = await Register.findOne({ Email: email });
      const i = req.query.i;
      await Register.updateMany(
        { Email: email },
        {
          $pull: {
            "cart.items": {
              productId: user.cart.items[i].productId,
              quantity: user.cart.items[i].quantity,
              price: user.cart.items[i].price,
              size: user.cart.items[i].size,
            },
          },
          $inc: {
            "cart.totalPrice": -user.cart.items[i].price,
            "cart.totalQty": -user.cart.items[i].quantity,
          },
        }
      );
      res.redirect("/cart");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function productPage(req, res) {
  try {
    const user = await Register.findOne({ Email: req.session.user });
    const productId = req.query.id;
    const productDetails = await newProduct.findOne({ _id: productId });
    const reviewDetails = await review
      .find({ productId: productId })
      .sort({ _id: -1 })
      .populate("productId")
      .populate("userId");
    console.log(reviewDetails);
    let totalReview = 0;
    let avgReview;
    if (reviewDetails != "") {
      for (let i = 0; i < reviewDetails.length; i++) {
        totalReview = reviewDetails[i].rating + totalReview;
      }
      avgReview = totalReview / reviewDetails.length;
      console.log(avgReview);
      await newProduct.updateOne(
        { _id: productId },
        {
          $set: {
            rating: avgReview,
          },
        }
      );
    }
    let productsInWishlist;
    let cartDetails;
    if (req.session.user) {
      productsInWishlist = await wishlist.findOne({
        userId: user._id,
        products: productId,
      });
      cartDetails = user.cart.totalQty;
    } else {
      cartDetails = null;
      productsInWishlist = null;
    }
    if (cartDetails == 0) {
      cartDetails = null;
    }
    let userReviewCheck = await review.find({ productId: productId });
    let userPresent;
    if (req.session.user) {
      console.log("hi");
      if (userReviewCheck != "") {
        for (let k = 0; k < userReviewCheck.length; k++) {
          if (mongoose.Types.ObjectId(userReviewCheck[k].userId) === user._id) {
            console.log("hiihi");
            userPresent = false;
            break;
          } else {
            console.log(user._id);
            console.log(mongoose.Types.ObjectId(userReviewCheck[k].userId));
            userPresent = true;
          }
        }
      } else {
        userPresent = true;
      }
    } else {
      userPresent = false;
    }
    const products = await newProduct.find({ active: true });
    res.render("item-productPage", {
      moment,
      products,
      avgReview,
      userPresent,
      cartDetails,
      reviewDetails,
      productDetails,
      productsInWishlist,
    });
  } catch (error) {
    console.log("hsdfdsvndf newof wve ne omcew" + error);
    res.redirect("/productPage/pageNotFound");
  }
}

async function backButton(req, res) {}
async function viewWishlist(req, res) {
  try {
    const email = req.session.user;
    const user = await Register.findOne({ Email: req.session.user });
    const totalPrice = user.cart;
    const wishlists = await wishlist
      .findOne({ userId: user._id })
      .populate("products");
    for (let i = 0; i < wishlists.products.length; i++) {
      if (wishlists.products[i].active == false) {
        const del = await wishlist.updateOne(
          { userId: user._id },
          {
            $pull: { products: wishlists.products[i]._id },
          }
        );
        console.log(del);
      }
    }
    const currentWishlists = await wishlist
      .findOne({ userId: user._id })
      .populate("products");
    const data = currentWishlists.products;
    const datas = await user.populate("cart.items.productId");
    const itemQty = datas.cart.totalQty;
    const usercartinfo = await Register.findOne({ Email: email });
    const cartItems = usercartinfo.cart.items;

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
    res.render("user-wishlist", {
      cartDetails,
      totalPrice,
      data,
      itemQty,
      cartItems,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function addToWishlist(req, res) {
  try {
    const productId = req.query.id;
    console.log(productId);
    const user = await Register.findOne({ Email: req.session.user });
    const productExist = await wishlist.findOne({
      userId: user._id,
      products: productId,
    });
    if (productExist) {
      res.redirect("/productPage?id=" + productId);
    } else {
      await wishlist.updateOne(
        { userId: user._id },
        {
          $push: {
            products: [productId],
          },
        }
      );
      res.redirect("/productPage?id=" + productId);
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function removeFromWishlist(req, res) {
  try {
    const user = await Register.findOne({ Email: req.session.user });
    await wishlist.updateOne(
      { userId: user._id },
      {
        $pull: {
          products: req.query.id,
        },
      }
    );
    res.redirect("/productPage?id=" + req.query.id);
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function removeFromWishlistFromWishlist(req, res) {
  try {
    const user = await Register.findOne({ Email: req.session.user });
    await wishlist.updateOne(
      { userId: user._id },
      {
        $pull: {
          products: req.query.id,
        },
      }
    );
    res.redirect("/wishlist");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function addCartCount(req, res) {
  try {
    const id = req.query.id;
    const size = req.query.size;
    console.log(size);
    const email = req.session.user;
    const productDetails = await newProduct.findOne({ _id: id });
    await Register.updateMany(
      {
        Email: email,
        "cart.items": {
          $elemMatch: {
            productId: id,
            size: size,
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
    let count = 1;
    res.json({ status: count });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function subractCartCount(req, res) {
  try {
    const id = req.query.id;
    const size = req.query.size;
    const produtID = mongoose.Types.ObjectId(id);
    const email = req.session.user;
    const productDetails = await newProduct.findOne({ _id: id });
    const productCount = await Register.aggregate([
      {
        $match: {
          Email: email,
        },
      },
      {
        $unwind: "$cart.items",
      },
      {
        $project: {
          _id: "$cart.items.productId",
          quantity: "$cart.items.quantity",
        },
      },
      {
        $match: {
          _id: produtID,
        },
      },
    ]);
    console.log(productCount[0].quantity);
    if (productCount[0].quantity > 1) {
      await Register.updateMany(
        {
          Email: email,
          "cart.items": {
            $elemMatch: {
              productId: id,
              size: size,
            },
          },
        },
        {
          $inc: {
            "cart.totalPrice": -productDetails.Price,
            "cart.totalQty": -1,
            "cart.items.$.quantity": -1,
            "cart.items.$.price": -productDetails.Price,
          },
        }
      );
    }

    let count = 1;
    res.json({ status: count });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function nameChange(req, res) {
  try {
    await Register.updateOne(
      { Email: req.session.user },
      {
        $set: {
          firstname: req.body.name,
        },
      }
    );
    res.redirect("/accountDetails");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function checkoutPage(req, res) {
  try {
    let user;
    let email;
    email = req.session.user;

    user = await Register.findOne({ Email: email });
    let product;
    if (user.cart.totalQty == 0) {
      res.redirect("/cart");
    } else {
      let mainAddress;
      const userDetails = await Register.findOne({ Email: email });
      if (userDetails) {
        mainAddress = userDetails.mainAddress;
      } else {
        mainAddress = null;
      }
      const totalPrice = user.cart;
      const data = await user.populate("cart.items.productId");
      product = data.cart.items;
      let address;

      address = await Register.aggregate([
        {
          $match: {
            Email: email,
          },
        },
        {
          $unwind: "$mainAddress",
        },
        {
          $match: {
            "mainAddress.status": true,
          },
        },
      ]);
      if (address != "") {
        address;
      } else {
        address = 1;
      }
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
      console.log(address);
      res.render("user-checkout", {
        cartDetails,
        address,
        mainAddress,
        product,
        totalPrice,
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function selectAddress(req, res) {
  try {
    const email = req.session.user;
    const addressid = req.body.address;
    // console.log(addressid);
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
    res.redirect("/checkoutPage");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function couponCheck(req, res) {
  try {
    const user = await Register.findOne({ Email: req.session.user });
    const totalPrice = user.cart.totalPrice;
    const couponCode = req.body.couponCode;
    const couponDetails = await coupon.findOne({
      code: couponCode,
      active: true,
    });
    if (couponCode != "") {
      if (couponDetails) {
        const usedCoupon = await Register.findOne({
          Email: req.session.user,
          couponUsed: couponDetails._id,
        });
        console.log(usedCoupon);
        if (!usedCoupon) {
          let discount = (totalPrice * couponDetails.discount) / 100;
          console.log(discount);
          let finalPrice = totalPrice - discount;
          res.json({
            data: {
              correctCoupon: `${couponDetails.name} <b>Coupon Applied <i class='fa-solid fa-check'></i></b>`,
              discount,
              finalPrice,
            },
          });
        } else {
          res.json({
            data: {
              correctCoupon: "Coupon aldready Used !!",
              discount: 0,
              finalPrice: totalPrice,
            },
          });
        }
      } else {
        res.json({
          data: {
            correctCoupon: "Coupon not found",
            discount: 0,
            finalPrice: totalPrice,
          },
        });
      }
    } else {
      res.json({
        data: {
          correctCoupon: "",
          discount: 5,
          finalPrice: totalPrice,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

let orderDetials;
let couponId;
async function postCheckout(req, res) {
  try {
    const addressId = req.body.address;
    const address = await Register.aggregate([
      { $match: { Email: req.session.user } },
      { $unwind: "$mainAddress" },
      { $match: { "mainAddress._id": mongoose.Types.ObjectId(addressId) } },
    ]);
    const userinfo = await Register.findOne({ Email: req.session.user });
    couponId = await coupon.findOne({
      code: req.body.couponCode,
      active: true,
    });
    if (couponId) {
      couponId = couponId._id;
    }
    let discount;
    if (req.body.discount == "") {
      discount = 0;
    } else {
      discount = req.body.discount;
    }
    orderDetials = new order({
      customer: userinfo._id,
      shippingAddress: {
        addressLine1: address[0].mainAddress.addressLine1,
        addressLine2: address[0].mainAddress.addressLine2,
        state: address[0].mainAddress.state,
        country: address[0].mainAddress.country,
        pin: address[0].mainAddress.pin,
        telephone: address[0].mainAddress.telephone,
      },
      paidAmount: userinfo.cart.totalPrice - req.body.discount,
      totalAmount: userinfo.cart.totalPrice,
      discount: discount,
      totalQty: userinfo.cart.totalQty,
      paymentMethod: req.body.payment,
      couponCode: couponId,
    });
    if (req.body.payment == "Cash On Delivery") {
      req.session.payment = true;
      res.redirect("/checkout/placeOrder/" + orderDetials._id);
    } else {
      res.redirect(
        "/checkout/paypal?discount=" +
          discount +
          "&orderDetials=" +
          orderDetials._id
      );
    }
  } catch (error) {
    console.log(error + "hihihi");
    res.redirect("/500/ErrorPage");
  }
}
async function orderResult(req, res) {
  if (req.session.payment) {
    await orderDetials.save();
    const cartinfo = await Register.findOne({
      Email: req.session.user,
    }).populate("cart.items.productId");
    for (let j = 0; j < cartinfo.cart.items.length; j++) {
      await order.updateOne(
        { _id: orderDetials._id },
        {
          $push: {
            orderItems: {
              productID: cartinfo.cart.items[j].productId._id,
              productName: cartinfo.cart.items[j].productId.Name,
              productImage: cartinfo.cart.items[j].productId.Image1,
              productSize: cartinfo.cart.items[j].size,
              productPrice: cartinfo.cart.items[j].productId.Price,
              productQty: cartinfo.cart.items[j].quantity,
              totalPrice: cartinfo.cart.items[j].price,
            },
          },
        }
      );
      if (cartinfo.cart.items[j].size == "Small") {
        await newProduct.updateOne(
          { _id: cartinfo.cart.items[j].productId },
          {
            $inc: {
              "stock.small": -cartinfo.cart.items[j].quantity,
              "stock.total": -cartinfo.cart.items[j].quantity,
            },
          }
        );
      } else if (cartinfo.cart.items[j].size == "Medium") {
        await newProduct.updateOne(
          { _id: cartinfo.cart.items[j].productId },
          {
            $inc: {
              "stock.medium": -cartinfo.cart.items[j].quantity,
              "stock.total": -cartinfo.cart.items[j].quantity,
            },
          }
        );
      } else if (cartinfo.cart.items[j].size == "Large") {
        await newProduct.updateOne(
          { _id: cartinfo.cart.items[j].productId },
          {
            $inc: {
              "stock.large": -cartinfo.cart.items[j].quantity,
              "stock.total": -cartinfo.cart.items[j].quantity,
            },
          }
        );
      } else if (cartinfo.cart.items[j].size == "X-Large") {
        await newProduct.updateOne(
          { _id: cartinfo.cart.items[j].productId },
          {
            $inc: {
              "stock.x_large": -cartinfo.cart.items[j].quantity,
              "stock.total": -cartinfo.cart.items[j].quantity,
            },
          }
        );
      } else if (cartinfo.cart.items[j].size == "XX-Large") {
        await newProduct.updateOne(
          { _id: cartinfo.cart.items[j].productId },
          {
            $inc: {
              "stock.xx_large": -cartinfo.cart.items[j].quantity,
              "stock.total": -cartinfo.cart.items[j].quantity,
            },
          }
        );
      }
    }
    await Register.updateOne(
      { Email: req.session.user },
      {
        $set: { "cart.items": [], "cart.totalPrice": 0, "cart.totalQty": 0 },
        $push: {
          order: [mongoose.Types.ObjectId(orderDetials._id)],
        },
      }
    );

    if (couponId) {
      const usedCoupon = await Register.findOne({
        Email: req.session.user,
        couponUsed: couponId,
      });
      console.log("ishdfidiuh");
      if (!usedCoupon) {
        await Register.updateOne(
          { Email: req.session.user },
          { $push: { couponUsed: [mongoose.Types.ObjectId(couponId)] } }
        );
      }
    }
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
    req.session.payment = false;
    res.render("user-paymentSuccess", { cartDetails });
  } else {
    res.redirect("/cart");
  }
}
async function orderPage(req, res) {
  try {
    const orderDetails = await Register.findOne({
      Email: req.session.user,
    }).populate("order");
    const orderItems = orderDetails.order;
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
    res.render("user-orderPage", { cartDetails, orderItems, moment });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function newAddress(req, res) {
  try {
    const address = await Register.findOne({ Email: req.session.user });
    const addressLength = address.mainAddress.length;
    await Register.updateOne(
      { Email: req.session.user },
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
    const user = await Register.findOne({ Email: req.session.user });
    const addressid = user.mainAddress[addressLength]._id;
    console.log(addressid);
    await Register.updateMany(
      { Email: req.session.user, "mainAddress.status": true },
      {
        $set: {
          "mainAddress.$.status": false,
        },
      }
    );
    await Register.updateOne(
      { Email: req.session.user, "mainAddress._id": addressid },
      {
        $set: {
          "mainAddress.$.status": true,
        },
      }
    );
    res.redirect("/checkoutPage");
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function nextBanner(req, res) {
  try {
    const bannerDetails = await banner.find({ list: true }).populate("product");
    console.log(bannerDetails);
    res.json({
      data: bannerDetails,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}
async function cancelOrder(req, res) {
  try {
    const orderId = req.params.id;
    await order.updateOne(
      { _id: orderId },
      {
        $set: {
          cancelStatus: true,
        },
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

async function page500(req, res) {
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
  const currentUser = await Register.findOne({ Email: req.session.user });
  res.render("500", {
    currentUser,
    cartDetails,
  });
}

async function unavailableProduct(req, res) {
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
  const currentUser = await Register.findOne({ Email: req.session.user });
  const products = await newProduct.find({ active: true });
  res.render("ProductNotFound", {
    currentUser,
    cartDetails,
    products,
  });
}

let products;
async function productSearch(req, res) {
  try {
    if (!products) {
      products = await newProduct.find({ active: true });
    }
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

    const category = await newCategory.find();
    res.render("productSearch", { cartDetails, products, category });
  } catch (error) {
    console.log(error);
    res.redirect("/500/ErrorPage");
  }
}

let currentFilter;
async function filterBy(req, res) {
  switch (req.query.filter) {
    case "Men":
      console.log("men");
      currentFilter = products.filter((product) => product.Category == "Men");
      break;
    case "Women":
      currentFilter = products.filter((product) => product.Category == "Women");
      break;
    case "none":
      currentFilter = null;
      break;

    default:
      console.log("entered invalid search entry");
      break;
  }
  console.log(currentFilter);
  products = currentFilter;
  res.json({
    success: 1,
  });
}
async function search(req, res) {
  let searchResult = [];
  console.log(req.query.search);
  const regex = new RegExp(req.query.search, "i");
  if (currentFilter) {
    currentFilter.map((product) => {
      if (regex.exec(product.Name)) {
        searchResult.push(product);
      }
    });
  } else {
    searchResult = await newProduct.find({
      active: true,
      Name: { $regex: req.query.search, $options: "i" },
    });
  }
  products = searchResult;
  res.json({
    success: 1,
  });
}
async function addReview(req, res) {
  try {
    if (req.session.user) {
      const user = await Register.findOne({ Email: req.session.user });
      console.log(req.query.productId);
      let currentReview;
      if (req.body.star1 == "on") {
        console.log("what fo oyoodsifj ");
        currentReview = new review({
          userId: user._id,
          productId: req.query.productId,
          rating: 1,
          review: req.body.review,
        });
      } else if (req.body.star2 == "on") {
        currentReview = new review({
          userId: user._id,
          productId: req.query.productId,
          rating: 2,
          review: req.body.review,
        });
      } else if (req.body.star3 == "on") {
        currentReview = new review({
          userId: user._id,
          productId: req.query.productId,
          rating: 3,
          review: req.body.review,
        });
      } else if (req.body.star4 == "on") {
        currentReview = new review({
          userId: user._id,
          productId: req.query.productId,
          rating: 4,
          review: req.body.review,
        });
      } else if (req.body.star5 == "on") {
        currentReview = new review({
          userId: user._id,
          productId: req.query.productId,
          rating: 5,
          review: req.body.review,
        });
      } else {
        currentReview = new review({
          userId: user._id,
          productId: req.query.productId,
          rating: 0,
          review: req.body.review,
        });
      }

      await currentReview.save();
      console.log(req.body);
      res.json({
        success: true,
      });
    } else {
      res.json({
        data: 1,
      });
    }
  } catch (error) {
    res.redirect("/500/ErrorPage");
  }
}

async function passwordCheck(req, res) {
  const user = await Register.findOne({ Email: req.session.user });
  const inputPassword = req.query.password;
  const comparepassword = await bcrypt.compare(inputPassword, user.Password);
  if (comparepassword) {
    res.json({
      data: true,
    });
  } else {
    res.json({
      data: false,
    });
  }
}

async function changePassword(req, res) {
  try {
    console.log(req.body);
    const newPassword = await bcrypt.hash(req.body.password, 10);
  await Register.updateOne(
    { Email: req.session.user },
    {
      $set: {
        Password: newPassword,
      },
    }
  );
  res.json({
    data: true,
  });
  } catch (error) {
    console.log(error);
    res.json({
      data : false
    })
  }
  
}
module.exports = {
  passwordCheck,
  changePassword,
  addReview,
  orderResult,
  search,
  filterBy,
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
  deleteCartItem,
  productPage,
  backButton,
  viewWishlist,
  addToWishlist,
  removeFromWishlist,
  addCartCount,
  removeFromWishlistFromWishlist,
  subractCartCount,
  nameChange,
  checkoutPage,
  selectAddress,
  couponCheck,
  postCheckout,
  orderPage,
  newAddress,
  nextBanner,
  cancelOrder,
  page500,
  unavailableProduct,
  productSearch,
};
