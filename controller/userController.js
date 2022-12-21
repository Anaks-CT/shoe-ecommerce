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
    console.log("checking password");
    // const useremail = await Register.findOne({Email: email})
    const useremail = Register.findOne({ Email: email });
    const userphone = Register.findOne({ Phone: Phone });
    console.log(email + " " + useremail.Email);
    if (password === cpassword) {
      console.log("password and cpassword equal");
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
          // const otpgen = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
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
          await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
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
    //    res.render('render', {error : 'email id taken'})
    res.send("passwords not matching");
    console.log(error);
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
    // const password = req.body.password
    const user = await Register.findOne({ Email: email });
    const comparepassword = bcrypt.compare(req.body.email, user.Email);
    if (comparepassword) {
      req.session.user = email;
      console.log("session created");
      res.redirect("/login2");
    } else {
      res.render("login", { error: "Invalid login details" });
    }
  } catch (error) {
    res.render("login", { error: "Invalid login details" });
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
};
