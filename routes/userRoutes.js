const express=require('express');
const userRoute=express.Router();
const authController=require('./../controllers/authController');
const userController=require('./../controllers/userController')

userRoute.route('/signup').post(authController.signUp);
userRoute.route('/login').post(authController.login);
userRoute.route('/logout').get(authController.logout)
userRoute.route('/forgotPassword').post(authController.forgotPassword)
userRoute.route('/resetPassword/:token').patch(authController.resetPassword);

userRoute.use(authController.protect);
userRoute.patch('/changePassword',authController.changePassword);
userRoute.patch('/updateMe',userController.uploadUserPhoto,userController.resizeUserPhoto,userController.updateMe)
userRoute.get('/me',userController.getMe)

userRoute.use(authController.restrictTo('admin'));
userRoute.get('/',userController.getAllUsers)
userRoute.route('/:id').get(userController.getUser).delete(userController.deleteUser)

module.exports=userRoute;