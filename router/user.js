const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userMiddleware = require('../middlewares/userSession')

router.get("/", userController.welcome);
router.get("/signup", userController.register);
router.post("/signup", userController.postRegister);
router.get("/login", userController.login);
router.post("/login", userController.postLogin);
router.get("/login2",userMiddleware, userController.userwelcome);
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
router.get('/editAddress',userController.editAddress)
router.post('/editAddress',userController.postEditAddress)
router.get('/deleteAddress',userController.deleteAddress)
router.get('/setasdefault',userController.setasdefault)
router.get('/men',userController.men)
router.get('/women',userController.women)
router.get('/cart',userController.cart)
router.get('/addToCart/:id',userMiddleware,userController.addToCart)
router.get('/deleteCartItem',userController.deleteCartItem)
router.get('/productPage',userController.productPage)
router.get('/productPage_backButton',userController.backButton)
router.get('/wishlist',userMiddleware,userController.viewWishlist)
router.get('/addToWishlist',userMiddleware,userController.addToWishlist)
router.get('/removeFromWishlist',userMiddleware,userController.removeFromWishlist)
router.get('/removeFromWishlistFromWishlist',userMiddleware,userController.removeFromWishlistFromWishlist)
router.get('/addCartCount/:id',userMiddleware,userController.addCartCount)
router.get('/subractCartCount/:id',userMiddleware,userController.subractCartCount)
router.post('/nameChange',userMiddleware,userController.nameChange)
router.get('/checkoutPage',userMiddleware,userController.checkoutPage)
router.post('/checkoutPage/selectAddress',userController.selectAddress)
router.put('/checkoutPage/checkCoupon',userController.couponCheck).post('/checkoutPage/checkCoupon',userController.postCheckout)
router.get('/order',userMiddleware,userController.orderPage)

module.exports = router;
