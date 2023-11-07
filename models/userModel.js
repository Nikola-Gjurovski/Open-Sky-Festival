const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const userMongoose=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please write your name']
    },
    email:{
        type:String,
        required:[true,'Please write your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    role:{
        type:String,
        enum:['admin','actor','user'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please provide your password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please provide your password'],
        validate:{validator:function(el){
           return el===this.password
        },
       message:'Passwords are not the same'
    }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }

    
});
userMongoose.pre('save',async function(next){
    if(!this.isModified('password'))
    return next();
this.password=await bcrypt.hash(this.password,12);
this.passwordConfirm=undefined;
next();

})
userMongoose.pre('save',async function(next){
    if(!this.isModified('password')||this.isNew){
     return next();
    }
    this.passwordChangedAt=Date.now()-1000;
    next();
})


userMongoose.methods.correctPassword=async function(password,userPassword){
    return await bcrypt.compare(password,userPassword);
}
userMongoose.methods.changePasswordAfter=function(JWTTimestamp){//timestarp when a JSON Web Token was issued
if(this.passwordChangedAt){
    const time=parseInt(this.passwordChangedAt.getTime()/1000,10)
    return JWTTimestamp<time;
}
return false;
}
userMongoose.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires=Date.now()+10*60*1000;
    return resetToken;
}

const User=mongoose.model('User',userMongoose);
module.exports=User;