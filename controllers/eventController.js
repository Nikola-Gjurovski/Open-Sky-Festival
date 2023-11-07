const express=require('express');
const fs=require('fs');
const multer=require('multer');
const sharp=require('sharp');
const Event=require('./../models/eventModel');
const AppError = require('../appError');
const catchAsync=fun=>{
    return (req,res,next)=>{
        fun(req,res,next).catch(next);
    }
}
const multerStorage=multer.memoryStorage();
const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{
        cb(new AppError('This path is image only',404),false);
    }
}
const upload=multer({
    storage:multerStorage,
    filter:multerFilter
})
exports.uploadEventImages=upload.fields([
    {
        name:'imageCover',maxCount:1
    },
    {
        name:'images',maxCount:3
    }
])
exports.resizeEventImages=catchAsync(async(req,res,next)=>{
    if(!req.files.imageCover || !req.files.images)return next();
    req.body.imageCover=`event-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer).resize(2000,1333)
    .toFormat('jpeg').jpeg({quality:90})
    .toFile(`public/img/${req.body.imageCover}`)
    req.body.images=[];
    await Promise.all(req.files.images.map(async(file,i)=>{
        const filename=`event-${req.params.id}-${Date.now()}-${i+1}.jpeg`
 
        await sharp(file.buffer).resize(2000,1333)
        .toFormat('jpeg').jpeg({quality:90})
        .toFile(`public/img/${filename}`);
        req.body.images.push(filename);
    }))
    next();
})
exports.getAllEvents=catchAsync(async(req,res,next)=>{
    const events=await Event.find();
    
    res.status(200).json({
        status:'success',
        results:events.length,
        data:{
            events
        }
    })
})
exports.getEvent=catchAsync(async (req,res,next)=>{
    const event=await Event.findById(req.params.id).populate('reviews');
    if(!event){
        return next(new AppError('No event found with that id',404));
    }
    res.status(200).json({
        status:'success',
        data:{
            event
        }
    })
})
exports.createEvent=catchAsync(async(req,res,next)=>{
    //console.log(req.body);
    const event=await Event.create(req.body);
    console.log(req.body);
  res.status(201).json({
        status:'success',
        data:{
            event
        }
    })
})
exports.UpdateEvent=catchAsync(async(req,res,next)=>{
   const event=await Event.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
   })
   if(!event){
    return next(new AppError('No event found with that id',404))
   }
   res.status(200).json({
    status:'success',
    data:{
        event
    }
   })
})
exports.DeleteEvent=catchAsync(async(req,res,next)=>{
    const event=await Event.findByIdAndDelete(req.params.id);
    if(!event){
        return next(new AppError('No event found with that'))
    }
    res.statsu(204).json({
        status:'success',
        data:null
    })
})