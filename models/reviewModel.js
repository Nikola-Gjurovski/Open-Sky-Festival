const mongoose=require('mongoose');
const slugify=require('slugify');
const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,"You must write a review"]
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        required:[true,'A review must belong to an event']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"A review must belong to a user"]
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'user',
        select:'name photo'
    })
    next();
})
const Review=mongoose.model('Review',reviewSchema);
module.exports=Review;