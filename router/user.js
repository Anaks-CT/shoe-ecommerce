const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userMiddleware = require("../middlewares/userSession");
const paypalController = require("../utility/paypal");

router.get("/", userController.welcome);
router
  .get("/signup", userController.register)
  .post("/signup", userController.postRegister);
router
  .get("/login", userController.login)
  .post("/login", userController.postLogin);
router.get("/login2", userMiddleware, userController.userwelcome);
router.get("/login3", userController.userwelcome2);
router
  .get("/signupotp", userController.signupotp)
  .post("/signupotp", userController.postsignupotp);
router
  .get("/forgotPassword", userController.forgotPassword)
  .post("/forgotPassword", userController.postforgotPassword);
router
  .get("/forgotPassword-OTP", userController.forgotPasswordOTP)
  .post("/forgotPassword-OTP", userController.postForgotPasswordOTP);
router
  .get("/userNewPassword", userController.userNewPassword)
  .post("/userNewPassword", userController.postUserNewPassword);
router.get(
  "/accountDetails",
  userMiddleware,
  userMiddleware,
  userController.accountDetails
);
router
  .route("/accountDetails/passwordCheck")
  .put(userMiddleware, userController.passwordCheck)
  .patch(userMiddleware, userController.changePassword);
router.get("/userAddress", userMiddleware, userController.userAddress);
router
  .get("/addAddress", userMiddleware, userController.addAddress)
  .post("/addAddress", userMiddleware, userController.postAddAddress);
router
  .get("/editAddress", userMiddleware, userController.editAddress)
  .post("/editAddress", userMiddleware, userController.postEditAddress);
router.get("/deleteAddress", userMiddleware, userController.deleteAddress);
router.get("/setasdefault", userMiddleware, userController.setasdefault);
router.get("/men", userController.men);
router.get("/women", userController.women);
router.get("/cart", userMiddleware, userController.cart);
router.get("/addToCart", userMiddleware, userController.addToCart);
router.get("/deleteCartItem", userMiddleware, userController.deleteCartItem);
router
  .route("/productPage")
  .get(userController.productPage)
  .put(userMiddleware, userController.addReview);
router.get("/productPage_backButton", userController.backButton);
router.get("/wishlist", userMiddleware, userController.viewWishlist);
router.get("/addToWishlist", userMiddleware, userController.addToWishlist);
router.get(
  "/removeFromWishlist",
  userMiddleware,
  userController.removeFromWishlist
);
router.get(
  "/removeFromWishlistFromWishlist",
  userMiddleware,
  userController.removeFromWishlistFromWishlist
);
router.get("/addCartCount", userMiddleware, userController.addCartCount);
router.get(
  "/subractCartCount",
  userMiddleware,
  userController.subractCartCount
);
router.post("/nameChange", userMiddleware, userController.nameChange);
router.get("/checkoutPage", userMiddleware, userController.checkoutPage);
router.post("/checkoutPage/selectAddress", userController.selectAddress);
router
  .put("/checkoutPage/checkCoupon", userMiddleware, userController.couponCheck)
  .post(
    "/checkoutPage/checkCoupon",
    userMiddleware,
    userController.postCheckout
  );
router.get(
  "/checkout/placeOrder/:orderId",
  userMiddleware,
  userController.orderResult
);
router.get("/order", userMiddleware, userController.orderPage);
router.post(
  "/checkoutPage/selectAddress/addAddress",
  userMiddleware,
  userController.newAddress
);
router.get("/nextBanner/:i", userController.nextBanner);
router.get("/cancelOrder/:id", userMiddleware, userController.cancelOrder);
router.get("/500/ErrorPage", userController.page500);
router.get("/productPage/pageNotFound", userController.unavailableProduct);
router
  .route("/products")
  .get( userController.productSearch)
  .put( userController.search)
  .patch( userController.filterBy)
  .post(userController.sort)
router
  .route("/checkout/paypal")
  .get(userMiddleware, paypalController.paypalgate);
// router.route('/')
module.exports = router;
