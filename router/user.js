const express = require('express')
const hbs = require('hbs')
const router=express.Router()
const userController = require('../controller/userController')


router.get('/',userController.welcome)
router.get('/signup', userController.register )
router.post('/signup', userController.postRegister )
router.get('/login', userController.login)
router.post('/login', userController.postLogin)
router.get('/login2', userController.userwelcome)
router.get('/login3', userController.userwelcome2)
router.get('/signupotp', userController.signupotp)
router.post('/signupotp', userController.postsignupotp)
router.get('/accountDetails', userController.accountDetails)

module.exports=router