const mongoose=require('mongoose')//npm i mongoose@5
const dotenv=require('dotenv');
const app=require("./app.js");
const port=4000;
dotenv.config({path:'./config.env'})
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(con=>{
    //console.log(con.connections)
    console.log("DB connection success ")
})
// const eventSchema=new mongoose.Schema({
//     name:{
//         type:String
//     },
//     rating:{
//         type:Number
//     },
//     price:{
//         type:Number
//     }
// })
// const Event=mongoose.model('Event',eventSchema);
// const testTour=new Event({
//     name:"The King"
// })
// testTour.save().then(doc=>{
// console.log(doc);
// }).catch(err=>{
//     console.log(err)
// })
const server=app.listen(port,()=>{
    console.log("App runnuing ...");
})
process.on('unhandledRejection',err=>{
console.log(err.name,"Unhandle rejection");
server.close(()=>{
    process.exit(1);
})
})