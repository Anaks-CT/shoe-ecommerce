const express = require('express')
const router=express.Router()
const adminController = require('../controller/adminController')
const upload = require('../utility/multer')

router.get('/adminredirect', adminController.adminsignin2)
router.get('/adminlogin', adminController.adminsignin)
router.post('/adminlogin', adminController.adminPostSignin)
router.get('/userdetails',adminController.userdetails)
router.get('/productDetail',adminController.productDetail)
router.get('/addProduct',adminController.addProduct)
router.post('/addProduct',upload.fields([
    { name: 'image', maxCount: 1},
    { name: 'image2', maxCount: 1},
    { name: 'image3', maxCount: 1},
    { name: 'image4', maxCount: 1},
    { name: 'image5', maxCount: 1},
    { name: 'image6', maxCount: 1},
]),adminController.postAddProduct)
router.get('/categoryDetails',adminController.categoryDetails)
router.get('/addCategory', adminController.addCategory)
router.post('/addCategory', adminController.postAddCategory)
router.get('/editProduct', adminController.editProduct)
router.post('/editProduct', upload.single('image'),adminController.post_editProduct)
router.get('/blockUser',adminController.blockUser)
router.get('/unblockUser',adminController.unblockUser)
router.get('/blockCategory',adminController.blockCategory)
router.get('/unblockCategory',adminController.unblockCategory)
router.get('/coupons',adminController.couponPage)
router.get('/addCoupon',adminController.addCoupon)
router.post('/addCoupon',adminController.postAddCoupon)
router.get('/deactivateCoupon',adminController.deactivateCoupon)
router.get('/reactivateCoupon',adminController.reactivateCoupon)
router.get('/orderList',adminController.orderList)
router.get('/orderList/orderDetail',adminController.orderDetail)
router.get('/orderDelivered',adminController.orderDelivered)
router.get('/adminDashboard',adminController.adminDashboard)
router.get('/banner',adminController.bannerPage)
router.get('/addToBanner',adminController.addToBanner)
router.get('/editBanner',adminController.editBanner)
router.post('/editBanner',adminController.postEditBanner)
router.get('/setBanner',adminController.setBanner)
router.get('/deleteBanner',adminController.deleteBanner)

module.exports=router