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
router.post('/addProduct',upload.single('image') ,adminController.postAddProduct)
router.get('/categoryDetails',adminController.categoryDetails)
router.get('/addCategory', adminController.addCategory)
router.post('/addCategory', adminController.postAddCategory)
router.get('/editProduct', adminController.editProduct)
router.post('/editProduct', upload.single('image'),adminController.post_editProduct)

module.exports=router