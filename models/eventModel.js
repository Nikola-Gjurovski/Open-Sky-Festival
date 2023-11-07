const mongoose=require('mongoose');
const slugify=require('slugify')
const validator=require('validator');
const eventSchema=mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'An event must have a name'],
        trim:true
    },
    slug:String,
    date:{
        type:String,
        required:[true,'An event must have a date ']
    },
    ratingsAverage:{
   type:Number,
   default:4.5,
   min:[1,'Rating must be above 1.0'],
   max:[5,'Rating must be below 5.0']
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'An event must have a price']
    },
    actors:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    duration:{
        type:'String',
        default:"20:00-22:00"
    },
    genre:{
        type:'String',
        required:[true,'An event must have a genre']
    },
    maxGroupSize:{
        type:Number,
        default:150
    },
    startLocation:{
        type:{
            type:'String',
            default:'Point',
            enum:['Point']
        },
        description:String,
        adress:String
    },
    images:[String],
    imageCover:{
        type:String
    },
    description:String
},
{
toJSON:{virtuals:true},
toObject:{virtuals:true}
});
eventSchema.index({price: 1,ratingsAverage: -1})
eventSchema.index({slug:1})
eventSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'event',
    localField:'_id'
    
})
eventSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true});
    next();
})
eventSchema.pre(/^find/,function(next){
    this.populate({
        path:'actors',
        select:'-__v -passwordChangedAt'
    })
    next();
})
eventSchema.post('save',function(doc,next){
    next();
})
const Event=mongoose.model('Event',eventSchema);
module.exports=Event;