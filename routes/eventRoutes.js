const express=require('express');
const fs=require('fs');
const eventRoute=express.Router();
const eventController=require('./../controllers/eventController');
const authController=require('./../controllers/authController');
const reviewController=require('./../controllers/reviewController');
const reviewRoute=require('./reviewRoutes');
eventRoute.route('/').get(eventController.getAllEvents).post(authController.protect,authController.restrictTo('admin'),eventController.createEvent);
eventRoute.route('/:id').get(eventController.getEvent).patch(authController.protect,authController.restrictTo('admin'),eventController.uploadEventImages,eventController.resizeEventImages, eventController.UpdateEvent).delete(authController.protect,authController.restrictTo('admin'),eventController.DeleteEvent);
//eventRoute.route('/:eventId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.createReview)
eventRoute.use('/:eventId/reviews',reviewRoute);
module.exports=eventRoute;
