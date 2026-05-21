/**
 * Production-Grade Error Handler
 * Standardizes API responses and prevents internal stack traces from leaking in production.
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error for internal tracking
  console.error(`[Error] ${err.name}: ${err.message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Handle specific known error types
  if (err.name === 'ZodError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: err.errors 
    });
  }

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid, missing, or expired token' 
    });
  }
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: 'The request payload exceeds the allowed size limit.'
    });
  }

  // Default fallback to 500
  const statusCode = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';
  const message = statusCode === 500 && isProd
    ? 'Internal Server Error' 
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      code: statusCode,
      message,
      ...( !isProd && { stack: err.stack } )
    }
  });
};
