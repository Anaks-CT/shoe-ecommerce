const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const upload = require("../utility/multer");
const adminSession = require("../middlewares/adminSession");

router
  .get("/adminlogin", adminController.adminsignin)
  .post("/adminlogin", adminController.adminPostSignin);
router.get("/userdetails", adminSession, adminController.userdetails);
router.get("/productDetail", adminSession, adminController.productDetail);
router.get("/addProduct", adminSession, adminController.addProduct).post(
  "/addProduct",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
    { name: "image6", maxCount: 1 },
  ]),
  adminController.postAddProduct
);
router.get("/categoryDetails", adminSession, adminController.categoryDetails);
router
  .get("/addCategory", adminSession, adminController.addCategory)
  .post("/addCategory", adminSession, adminController.postAddCategory);
router
  .get("/editProduct", adminSession, adminController.editProduct)
  .post("/editProduct", adminSession, adminController.post_editProduct);
router
  .get(
    "/productDetails/editProductImages",
    adminSession,
    adminController.editProductImages
  )
  .post(
    "/productDetails/editProductImages",
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
      { name: "image5", maxCount: 1 },
      { name: "image6", maxCount: 1 },
    ]),
    adminSession,
    adminController.postEditImages
  );
router.get("/blockUser", adminSession, adminController.blockUser);
router.get("/unblockUser", adminSession, adminController.unblockUser);
router.get("/blockCategory", adminSession, adminController.blockCategory);
router.get("/unblockCategory", adminSession, adminController.unblockCategory);
router.get("/coupons", adminSession, adminController.couponPage);
router
  .get("/addCoupon", adminSession, adminController.addCoupon)
  .post("/addCoupon", adminSession, adminController.postAddCoupon);
router.get("/deactivateCoupon", adminSession, adminController.deactivateCoupon);
router.get("/reactivateCoupon", adminSession, adminController.reactivateCoupon);
router.get("/orderList", adminSession, adminController.orderList);
router.get("/orderList/orderDetail", adminSession, adminController.orderDetail);
router.get("/orderDelivered", adminSession, adminController.orderDelivered);
router
  .get("/adminDashboard", adminSession, adminController.adminDashboard)
  .put("/adminDashboard", adminSession, adminController.graphData);
router.get("/banner", adminSession, adminController.bannerPage);
router.get("/addToBanner", adminSession, adminController.addToBanner);
router
  .get("/editBanner", adminSession, adminSession, adminController.editBanner)
  .post("/editBanner", adminSession, adminController.postEditBanner);
router.get("/setBanner", adminSession, adminController.setBanner);
router.get("/deleteBanner", adminSession, adminController.deleteBanner);
router.get(
  "/productDetail/unlistProduct",
  adminSession,
  adminController.unlistProduct
);
router.get(
  "/productDetail/listProduct",
  adminSession,
  adminController.listProduct
);
module.exports = router;
