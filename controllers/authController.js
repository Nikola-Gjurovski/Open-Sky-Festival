const { promisify }=require('util')
const jwt=require('jsonwebtoken')
const crypto=require('crypto');
const User=require('./../models/userModel');
const AppError = require('../appError');
const sendEmail = require('./mailController');
const catchAsync=fun=>{
    return (req,res,next)=>{
        fun(req,res,next).catch(next);
    }
}
const signToken=id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}
const success=(user,statusCode,res)=>{
    const token=signToken(user._id);
    const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN* 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      };
    res.cookie('jwt',token,cookieOptions);
    user.password=undefined;
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
}
exports.signUp=catchAsync(async (req,res,next)=>{
    const user=await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    success(user,201,res)
})
exports.login=catchAsync(async(req,res,next)=>{
    const{email,password}=req.body;
    if(!email || !password){
        return next(new AppError('Please provide email and password',400))
    }
    const user=await User.findOne({email}).select('+password');
    if(!user || !(await user.correctPassword(password,user.password)))
    {
        return next(new AppError('Incorect email or password',401));
    }
    success(user,200,res);
})
exports.logout=(req,res)=>{
    res.cookie('jwt','loggedout',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    })
    res.status(200).json({status:'success'})
}
exports.protect=catchAsync(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.jwt){
        token=req.cookies.jwt;
    }
    if(!token){
        return next(new AppError('You are not logged in',401))
    }
    console.log(await promisify(jwt.verify)(token, process.env.JWT_SECRET))

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded)
  
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
  
    // 4) Check if user changed password after the token was issued
    if (currentUser.changePasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }
    req.user=currentUser;
    res.locals.user=currentUser;
   // req.locals.user=currentUser;
    next();
})
exports.loginForm=async(req,res,next)=>{
    if(req.cookies.jwt){
        try{
          const decoded=await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
          const user=await User.findById(decoded.id);
          if(!user){
            return next();
          }
          if(user.changePasswordAfter(decoded.iat)){
            return next();
          }
          res.locals.user=user;
          return next();
        }
        catch(err){
            return next();
        }
    }
    next();
}
exports.restrictTo=(...roles)=>{
return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new AppError("You don't have permission to do this action",403))
    }
    next();
}
}
exports.forgotPassword=catchAsync(async(req,res,next)=>{
    const email=req.body.email;
    const user=await User.findOne({email})
    if(!user){
        return next(new AppError("There is no user with that mail",404))
    }
    const createToken=user.createPasswordResetToken();
    await user.save({validateBeforeSave:false})
    const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${createToken}`
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}\n If you didn't forget your password, please ignore this email!`;
    try{
        await sendEmail({
            email:user.email,
            subject:`Your password reset token(valid for 10 min)`,
            message,
        })
        res.status(200).json({
            status:'success',
            message:"Token send to email"
        })
    }
    catch(err){
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        await user.save({validateBeforeSave:false});
        return next(new AppError("There was a problem with sending the email.Please try again later"))
       
    }
    next();
})
exports.resetPassword=catchAsync(async(req,res,next)=>{
    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user=await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{ $gt:Date.now() }
    });
    if(!user){
        return next(new AppError('Token is invalid or has expired',400))
    }
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    success(user,200,res)
})
exports.changePassword=catchAsync(async(req,res,next)=>{
 const currentPassword=req.body.currentPassword;
 const user=await User.findById(req.user.id).select('+password');
 if(!user && !(await user.correctPassword(currentPassword,user.password))){
  return next(new AppError("Incorrect email or password",401))
 }
 user.password=req.body.password;
 user.passwordConfirm=req.body.passwordConfirm;
 await user.save();
 success(user,200,res);
})