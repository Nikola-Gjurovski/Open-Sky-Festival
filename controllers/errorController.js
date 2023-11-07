const AppError=require('./../appError');
const sendError=(err,req,res)=>{
    if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    }
    else{
        res.status(err.statusCode).render('error',{
            title:'Something went wrong!',
            msg:err.message
        })
    }
  
}
const handleInvalidToken=()=>{
    return new AppError("Invalid Token,please log in again",401)
}
const handleJWTExpired=()=>{
    return new AppError('Your token has expired',401)
}
module.exports=(err,req,res,next)=>{
    let error={...err};
    err.statusCode=err.statusCode||500;
    err.status=err.status ||'error';
    if(err.name==='JsonWebTokenError')
    err=handleInvalidToken();
    if(err.name==='TokenExpiredError')
    err=handleJWTExpired();
    
    sendError(err,req,res)
}