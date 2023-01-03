const Register = require("../src/models/database");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const newProduct = require("../src/models/products");
const wishlist = require("../src/models/wishlist");
const mongoose = require("mongoose");
const e = require("express");

async function welcome(req, res) {
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
  const product = await newProduct.find({});
  const product2 = await newProduct.find({}).skip(6);
  const product3 = await newProduct.find({}).skip(12);
  res.render("welcome", { cartDetails, product, product2, product3 });
}

async function register(req, res) {
  let cartDetails = null;
  res.render("register", { cartDetails });
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
    res.send("passwords not matching");
  }
}

async function signupotp(req, res) {
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
}

async function postsignupotp(req, res) {
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
    res.render("signupotp", { error: "OTP entered is incorrect", cartDetails });
  }
}

async function login(req, res) {
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
}

function userwelcome2(req, res) {
  if (req.session.user) {
    res.redirect("/accountDetails");
  } else {
    res.redirect("/login");
  }
}

async function forgotPassword(req, res) {
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
}

async function postForgotPasswordOTP(req, res) {
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
}

async function userNewPassword(req, res) {
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
    // const defaultAddress = address[0].mainAddress
    // console.log(defaultAddress);
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
}
async function userAddress(req, res) {
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
}

async function addAddress(req, res) {
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
      productDetails1,
      productDetails2,
      productDetails3,
      fullProducts,
      product,
      cartDetails,
    });
  } else {
    const productDetails1 = await newProduct.find({ Category: "Men" }).limit(6);
    const productDetails2 = await newProduct
      .find({ Category: "Men" })
      .skip(6)
      .limit(6);
    const productDetails3 = await newProduct.find({ Category: "Men" }).skip(12);
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
      productDetails1,
      productDetails2,
      productDetails3,
      cartDetails,
    });
  }
}

async function women(req, res) {
  const productDetails1 = await newProduct.find({ Category: "Women" }).limit(6);
  const productDetails2 = await newProduct
    .find({ Category: "Women" })
    .skip(6)
    .limit(6);
  const productDetails3 = await newProduct.find({ Category: "Women" }).skip(12);
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
    productDetails1,
    productDetails2,
    productDetails3,
    cartDetails,
  });
}
async function cart(req, res) {
  if (req.session.user) {
    const email = req.session.user;
    const user = await Register.findOne({ Email: email });
    const totalPrice = user.cart;
    const data = await user.populate("cart.items.productId");
    const product = data.cart.items;
    // console.log(product);
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
    res.render("user-cart", { product, cartDetails, totalPrice });
  } else {
    res.redirect("/login");
  }
}

async function addToCart(req, res) {
  if (req.session.user) {
    const email = req.session.user;
    const id = req.params.id;
    const productDetails = await newProduct.findOne({ _id: id });
    const user = await Register.findOne({ Email: email });
    const details = await Register.aggregate([
      { $match: { Email: email } },
      { $project: { id: "$cart.items.productId" } },
      { $unwind: "$id" },
    ]);
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
      const currentUser = await Register.findOne({ Email: req.session.user });
      const count = currentUser.cart.totalQty;
      res.json({ status: count });
    } else {
      for (let i = 0; i < user.cart.items.length; i++) {
        let detailsID = new String(details[i].id).trim();
        if (detailsID == id) {
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
              },
            },
            $inc: {
              "cart.totalPrice": productDetails.Price,
              "cart.totalQty": 1,
            },
          }
        );
        // res.redirect("/men");
        const currentUser = await Register.findOne({ Email: req.session.user });
        const count = currentUser.cart.totalQty;
        const data = await user.populate("cart.items.productId");
        const product = data.cart.items;
        res.json({ status: count, product: product });
      } else {
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
        // res.redirect("/men");
        const currentUser = await Register.findOne({ Email: req.session.user });
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
        res.json({ status: count });
      }
    }
  } else {
    res.redirect("/login");
  }
}

async function deleteCartItem(req, res) {
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
}
async function productPage(req, res) {
  const user = await Register.findOne({ Email: req.session.user });
  const productId = req.query.id;
  const productDetails = await newProduct.findOne({ _id: productId });
  console.log(productDetails);
  let productsInWishlist;

  let cartDetails;
  if (req.session.user) {
    productsInWishlist = await wishlist.findOne({
      userId: user._id,
      products: productId,
    });
    console.log(productsInWishlist);
    cartDetails = user.cart.totalQty;
  } else {
    cartDetails = null;
    productsInWishlist = null;
  }
  if (cartDetails == 0) {
    cartDetails = null;
  }
  res.render("item-productPage", {
    cartDetails,
    productDetails,
    productsInWishlist,
  });
}

async function backButton(req, res) {}
async function viewWishlist(req, res) {
  const email = req.session.user;
  const user = await Register.findOne({ Email: req.session.user });
  const wishlists = await wishlist
    .findOne({ userId: user._id })
    .populate("products");
  const totalPrice = user.cart;
  const data = wishlists.products;
  // const data = await wishlist.populate("products");
  // console.log(wishlists.products);
  // const product = data.cart.items;

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
  res.render("user-wishlist", { cartDetails, totalPrice, data });
}
async function addToWishlist(req, res) {
  const productId = req.query.id;
  console.log(productId);
  const user = await Register.findOne({ Email: req.session.user });
  const productExist = await wishlist.findOne({
    userId: user._id,
    products: productId,
  });
  // console.log(productExist);
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
    // console.log("added to wishlist");
    res.redirect("/productPage?id=" + productId);
  }

  // res.json({status : "hi anaks"})
}
async function removeFromWishlist(req, res) {
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
}
async function removeFromWishlistFromWishlist(req, res) {
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
}
async function addCartCount(req, res) {
  const id = req.params.id;
  const email = req.session.user;
  const productDetails = await newProduct.findOne({ _id: id });
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
  let count = 1;
  res.json({ status: count });
}

async function subractCartCount(req, res) {
  const id = req.params.id;
  const produtID = mongoose.Types.ObjectId(id);
  const email = req.session.user;
  const productDetails = await newProduct.findOne({ _id: id });
  // const user = await Register.findOne({
  //   Email: email,
  //   "user.cart.items": {
  //     $elemMatch: {
  //       productId: id,
  //     },
  //   },
  // });

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
}

async function nameChange(req, res) {
  await Register.updateOne(
    { Email: req.session.user },
    {
      $set: {
        firstname: req.body.name,
      },
    }
  );
  res.redirect("/accountDetails");
}

async function checkoutPage (req,res) {
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
  res.render('user-checkout',{cartDetails})
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
  checkoutPage
};
