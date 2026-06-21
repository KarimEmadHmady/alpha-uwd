const errorHandler = (err, req, res, next) => {
  
    const statusCode = err.status || 500; 
    const message = err.message || 'Something went wrong.';
  
    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack, 
    });
  };
  
  export default errorHandler;