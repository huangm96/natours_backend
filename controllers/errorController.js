const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateErrorDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: "${value}". Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again!', 401);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    //1)Log Error
    console.error('error', err);
    //2)Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  //   console.log(err);
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.kind === 'ObjectId') {
      error = handleCastErrorDB(error);
      sendErrorProd(error, res);
    }

    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
      sendErrorProd(error, res);
    }
    if (error._message && error._message.includes('validation failed')) {
      error = handleValidationErrorDB(error);
      sendErrorProd(error, res);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
      sendErrorProd(error, res);
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
      sendErrorProd(error, res);
    }
    sendErrorProd(err, res);
  }
};
