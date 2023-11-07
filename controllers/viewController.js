const express=require('express');
const fs=require('fs');
const User=require('./../models/userModel');
const Event=require('./../models/eventModel');
const AppError = require('../appError');
const catchAsync=fun=>{
    return (req,res,next)=>{
        fun(req,res,next).catch(next);
    }
}
exports.getOverview=catchAsync(async (req,res,next)=>{
    const events=await Event.find();
    res.status(200).render('overview',{
        title:'All events',
        events
    })
})
exports.getEvent=catchAsync(async(req,res,next)=>{
    const event=await Event.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        fields:'review rating user'
    })
    if(!event){
        return next(new AppError('There is no event with that name',404))
    }
    res.status(200).render('event',{
        title:`${event.name}`,
        event
    })
})
exports.getLoginForm=catchAsync(async(req,res)=>{
    res.status(200).render('login',{
        title:'Log into your account'
    })
})
exports.getMe=catchAsync(async(req,res,next)=>{
    res.status(200).render('account',{
        title:'Welcome to your account'
    })
})
exports.signUp=catchAsync(async(req,res,next)=>{
    res.status(200).render('signup',{
        title:'Create your account'
    })
})
exports.getUs=catchAsync(async(req,res)=>{
    res.status(200).render('aboutUs',{
        title:'About us'
    })
})