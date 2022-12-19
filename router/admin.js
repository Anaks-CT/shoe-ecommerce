const express = require('express')
const router=express.Router()
// const Register = require('../src/models/database')
const adminController = require('../controller/adminController')
const upload = require('../utility/multer')

router.get('/adminredirect', adminController.adminsignin2)
router.get('/adminlogin', adminController.adminsignin)
router.post('/adminlogin', adminController.adminPostSignin)
router.get('/userdetails',adminController.userdetails)
router.get('/productDetail',adminController.productDetail)
router.get('/addProduct',adminController.addProduct)
router.post('/addProduct',upload.single('image') ,adminController.postAddProduct)

module.exports=router