class AppError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode+"";
        //this.status=`${statusCode}`.startsWith('4')?"fail":"error";
        this.status=this.statusCode.startsWith('4')?"fail":"error"
        Error.captureStackTrace(this,this.constructor);//is used to capture the stack trace when an instance of AppError is created

    }
} 
module.exports=AppError;