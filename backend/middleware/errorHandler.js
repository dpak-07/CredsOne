/**
 * Error Handling Middleware
 */

/**
 * Custom Error Class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found Handler
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode: error.statusCode
    });
  } else {
    console.error('Error:', err.message);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    let message = 'File upload error';
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size is too large. Maximum size is 5MB';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    }
    
    error = new AppError(message, 400);
  }

  // Blockchain errors
  if (err.message && err.message.includes('blockchain')) {
    error.statusCode = 503;
    error.message = 'Blockchain service temporarily unavailable';
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    error.statusCode = 503;
    error.message = 'Database connection error. Please try again later';
  }

  // Send error response
  const response = {
    success: false,
    message: error.message || 'Internal server error'
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(error.statusCode).json(response);
};

/**
 * Async handler wrapper
 * Catches errors in async functions and passes them to error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Handle unhandled routes
 */
const handleInvalidRoute = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: {
      auth: '/api/auth',
      certificates: '/api/certificates',
      verifications: '/api/verifications',
      audit: '/api/audit',
      digilocker: '/api/digilocker',
      users: '/api/users'
    }
  });
};

/**
 * Validation error formatter
 */
const formatValidationErrors = (errors) => {
  return errors.array().map(error => ({
    field: error.path,
    message: error.msg,
    value: error.value
  }));
};

/**
 * Database error handler
 */
const handleDatabaseError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return {
      statusCode: 400,
      message: `Duplicate value for field: ${field}`
    };
  }

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return {
      statusCode: 400,
      message: 'Validation failed',
      errors
    };
  }

  return {
    statusCode: 500,
    message: 'Database operation failed'
  };
};

/**
 * Blockchain error handler
 */
const handleBlockchainError = (error) => {
  console.error('Blockchain error:', error);

  if (error.message.includes('insufficient funds')) {
    return {
      statusCode: 503,
      message: 'Insufficient blockchain funds for transaction'
    };
  }

  if (error.message.includes('nonce')) {
    return {
      statusCode: 503,
      message: 'Blockchain transaction pending. Please try again'
    };
  }

  if (error.message.includes('gas')) {
    return {
      statusCode: 503,
      message: 'Blockchain gas estimation failed'
    };
  }

  return {
    statusCode: 503,
    message: 'Blockchain service error. Operation will be retried'
  };
};

module.exports = {
  AppError,
  notFound,
  errorHandler,
  asyncHandler,
  handleInvalidRoute,
  formatValidationErrors,
  handleDatabaseError,
  handleBlockchainError
};
