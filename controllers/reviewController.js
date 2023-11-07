const express=require('express');
const fs=require('fs');
const Review=require('./../models/reviewModel');
const AppError = require('../appError');
const catchAsync=fun=>{
    return (req,res,next)=>{
        fun(req,res,next).catch(next);
    }
}
exports.gertAllReviews=catchAsync(async (req,res,next)=>{
    let filter={};
    if(req.params.eventId){
        filter={event:req.params.eventId}
    }
    const review=await Review.find(filter);
    res.status(200).json({
        status:"success",
        results:review.length,
        data:{
            review
        }
    })
})
exports.getReview=catchAsync(async(req,res,next)=>{
    const review=await Review.findById(req.params.id);
    if(!review){
        return next(new AppError("This review does not exist",404))
    }
    res.status(200).json({
        status:'success',
        data:{
            review
        }
    })

})
exports.createReview=catchAsync(async(req,res,next)=>{
    if(!req.body.event){
        req.body.event=req.params.eventId
    }
    if(!req.body.user){
        req.body.user=req.user.id;
    }
    const review=await Review.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            review
        }
    })
})

exports.updateReview=catchAsync(async(req,res,next)=>{
    const findreview=await Review.findById(req.params.id);
    if(findreview.user.id!==req.user.id){
        return next(new AppError("You are not the creator of this review",404))
    }
    const review=await Review.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    if(!review){
        return next(new AppError("This review does not exist",404)) 
    }
    res.status(200).json({
        status:'success',
        data:review
    })
})
exports.deleteReview=catchAsync(async(req,res,next)=>{
  
    const findreview=await Review.findById(req.params.id);
    if(findreview.user.id!==req.user.id && req.user.role!=='admin'){
        return next(new AppError("You are not the creator of this review",404))
    }
    const review=await Review.findByIdAndDelete(req.params.id);
    if(!review){
        return next(new AppError("This review does not exist",404))
    }
    res.status(204).json({
        status:"success",
        data:null
    })
})
