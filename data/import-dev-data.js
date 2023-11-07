const fs=require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const Event=require('./../models/eventModel');
const Review=require('./../models/reviewModel');
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(con=>{
    //console.log(con.connections)
   // console.log("DB connection success ")
})
const events=JSON.parse(fs.readFileSync('./data/event.json','utf-8'));
const reviews=JSON.parse(fs.readFileSync('./data/reviews.json','utf-8'));
const importData=async()=>{
    try{
        await Event.create(events);
        await Review.create(reviews);
        console.log("Data successfull")
        process.exit();
    }
    catch(err){
        console.log(err);
    }
}
const deleteData=async()=>{
    try{
        await Event.deleteMany();
        await Review.deleteMany();
        console.log("Data is ready!")
        process.exit();
    }
    catch(err){
        console.log(err);
    }
}
if(process.argv[2]==='--import'){
    importData();
}
else if(process.argv[2]==='--delete'){
    deleteData();
}