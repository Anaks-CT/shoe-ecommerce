const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/", userController.welcome);
router.get("/signup", userController.register);
router.post("/signup", userController.postRegister);
router.get("/login", userController.login);
router.post("/login", userController.postLogin);
router.get("/login2", userController.userwelcome);
router.get("/login3", userController.userwelcome2);
router.get("/signupotp", userController.signupotp);
router.post("/signupotp", userController.postsignupotp);
router.get('/forgotPassword',userController.forgotPassword)
router.post('/forgotPassword',userController.postforgotPassword)
router.get('/forgotPassword-OTP',userController.forgotPasswordOTP)
router.post('/forgotPassword-OTP',userController.postForgotPasswordOTP)
router.get('/userNewPassword',userController.userNewPassword)
router.post('/userNewPassword',userController.postUserNewPassword)
router.get("/accountDetails", userController.accountDetails);
router.get('/userAddress',userController.userAddress)
router.get('/addAddress',userController.addAddress)
router.post('/addAddress',userController.postAddAddress)


module.exports = router;
