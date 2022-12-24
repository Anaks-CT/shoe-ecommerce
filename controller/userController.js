const Register = require("../src/models/database");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
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

async function accountDetails(req, res) {
  if (req.session.user) {
    const email = req.session.user;
    const userDetails = await Register.findOne({ Email: email });
    res.render("user-accountDetails", { userDetails });
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
  res.redirect("/userAddress");
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
};
