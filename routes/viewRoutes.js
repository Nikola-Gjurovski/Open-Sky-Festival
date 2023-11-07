const express=require('express');
const viewRoute=express.Router();
const viewController=require('./../controllers/viewController');
const authController=require('./../controllers/authController');
viewRoute.get('/',authController.loginForm,viewController.getOverview);
viewRoute.get('/event/:slug',authController.loginForm,viewController.getEvent)
viewRoute.get('/login',authController.loginForm,viewController.getLoginForm)
viewRoute.get('/signup',authController.loginForm,viewController.signUp)
viewRoute.get('/me',authController.protect,viewController.getMe)
viewRoute.get('/aboutUs',viewController.getUs)
module.exports=viewRoute;