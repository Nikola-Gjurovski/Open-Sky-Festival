const express=require('express');
const fs=require('fs');
const multer=require('multer');
const sharp=require('sharp');
const User=require('./../models/userModel');
const AppError = require('../appError');
const catchAsync=fun=>{
    return (req,res,next)=>{
        fun(req,res,next).catch(next);
    }
}
const multerStorage=multer.memoryStorage();
const multerFIlter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{
        cb(new AppError('This path is image only,400'),false)
    }
}
const upload=multer({
    storage:multerStorage,
    filter:multerFIlter
});
exports.uploadUserPhoto=upload.single('photo');
exports.resizeUserPhoto=async(req,res,next)=>{
    if(!req.file)return next();
    req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`
    await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90})
    .toFile(`public/img/users/${req.file.filename}`)
    next();
}
const allowCHanges=(obj,...allow)=>{
    const newObj={};
    Object.keys(obj).forEach(items=>{
        if(allow.includes(items)){
            newObj[items]=obj[items]//to get the value of the elements
        }
    })
    return newObj;
}
exports.updateMe=catchAsync(async(req,res,next)=>{
    if (req.body.password || req.body.passwordConfirm) {
        return next(
          new AppError(
            'This route is not for password updates. Please use /updateMyPassword.',
            400
          )
        );
      }
      const update=allowCHanges(req.body,'name','email')
      if(req.file){
        update.photo=req.file.filename;
      }
    const user=await User.findByIdAndUpdate(req.user.id,update,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        status:"succes",
        data:{
            user
        }
    })
})
exports.getAllUsers=catchAsync(async(req,res,next)=>{
    const user=await User.find();
    res.status(200).json({
        status:'success',
        results:user.length,
        data:user
    })
})
exports.getUser=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if (!user) {
      
        return next(new AppError(`No user found with that ID`, 404));
      }
    res.status(200).json({
        status:'success',
         data:user
    })
})
exports.getMe=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    if (!user) {
      
        return next(new AppError(`No user found with that ID`, 404));
      }
    res.status(200).json({
        status:'success',
         data:user
    })
})
exports.deleteUser=catchAsync(async(req,res,next)=>{
    const user=await User.findByIdAndDelete(req.params.id);
    if (!user) {
      
        return next(new AppError(`No user found with that ID`, 404));
      }
    res.status(204).json({
        status:'success',
         data:null
    })
})