import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: {
      code: 429,
      message: 'Too Many Requests: You have exceeded the rate limit. Please try again later.'
    }
  }
});

// Stricter rate limit for emergency ingestion endpoints
export const emergencyIngestionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 30, // Limit each IP to 30 requests per minute
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      code: 429,
      message: 'Too Many Requests: Emergency API rate limit exceeded.'
    }
  }
});
