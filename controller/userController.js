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
    res.render("userwelcome");
  } else {
    res.render("login");
  }
}

function accountDetails(req, res) {
  res.render("user-accountDetails");
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

function userAddress (req,res) {
  res.render('user-address')
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
  userAddress
};
