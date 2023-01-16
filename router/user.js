const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userMiddleware = require('../middlewares/userSession')
const paypalController = require('../utility/paypal')


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
router.get('/cart',userMiddleware,userController.cart)
router.get('/addToCart',userMiddleware,userController.addToCart)
router.get('/deleteCartItem',userController.deleteCartItem)
router.route('/productPage').get(userController.productPage).put(userMiddleware,userController.addReview)
router.get('/productPage_backButton',userController.backButton)
router.get('/wishlist',userMiddleware,userController.viewWishlist)
router.get('/addToWishlist',userMiddleware,userController.addToWishlist)
router.get('/removeFromWishlist',userMiddleware,userController.removeFromWishlist)
router.get('/removeFromWishlistFromWishlist',userMiddleware,userController.removeFromWishlistFromWishlist)
router.get('/addCartCount',userMiddleware,userController.addCartCount)
router.get('/subractCartCount',userMiddleware,userController.subractCartCount)
router.post('/nameChange',userMiddleware,userController.nameChange)
router.get('/checkoutPage',userMiddleware,userController.checkoutPage)
router.post('/checkoutPage/selectAddress',userController.selectAddress)
router.put('/checkoutPage/checkCoupon',userController.couponCheck).post('/checkoutPage/checkCoupon',userController.postCheckout)
router.get('/checkout/placeOrder/:orderId',userController.orderResult)
router.get('/order',userMiddleware,userController.orderPage)
router.post('/checkoutPage/selectAddress/addAddress',userMiddleware,userController.newAddress)
router.get('/nextBanner/:i',userController.nextBanner)
router.get('/cancelOrder/:id',userMiddleware,userController.cancelOrder)
router.get('/500/ErrorPage', userController.page500)
router.get('/productPage/pageNotFound',userController.unavailableProduct)
router.route('/products').get(userController.productSearch).put(userController.search).patch(userController.filterBy)
router.route('/checkout/paypal').get(userMiddleware,paypalController.paypalgate)
// router.route('/')
module.exports = router;
