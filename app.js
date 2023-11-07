const express=require('express');
const morgan=require('morgan')
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser=require('cookie-parser');
const eventRoute=require('./routes/eventRoutes');
const userRoute=require('./routes/userRoutes');
const reviewRoute=require('./routes/reviewRoutes');
const viewRoute=require('./routes/viewRoutes');
const app=express();
const AppError=require('./appError');
const ErrorHandler=require('./controllers/errorController');

const path=require('path');
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'))

app.use((req,res,next)=>{
    console.log("Hello from the middlware")
    next();
})
const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many request from this IP,please try again later'
})

app.use(helmet());
app.use('/api',limiter);
app.use(morgan('dev'))
app.use(express.json({limit:'10kb'}));//ova ti treba za da mozhes req.body
app.use(express.urlencoded({ extended: true,limit:'10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist:['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}));

// app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'public')))
app.use('/',viewRoute);
app.use('/api/v1/events',eventRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/reviews',reviewRoute);



app.all('*',(req,res,next)=>{
    next(new AppError( `Can't  find ${req.originalUrl} on this server!`,404));
})
app.use(ErrorHandler);
module.exports=app;