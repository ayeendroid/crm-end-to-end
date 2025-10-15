import rateLimit from "express-rate-limit";

// General API rate limiter - VERY PERMISSIVE FOR DEVELOPMENT
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max:
    process.env.NODE_ENV === "production"
      ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100")
      : 10000, // EXTREMELY high limit in development (10,000 requests per 15 min)
  message: {
    success: false,
    error: {
      message: "Too many requests from this IP, please try again later.",
    },
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => process.env.NODE_ENV !== "production", // SKIP rate limiting entirely in development
});

// Stricter rate limiter for authentication routes - PERMISSIVE FOR DEVELOPMENT
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 5 : 1000, // Very high limit in development
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    error: {
      message:
        "Too many login attempts from this IP, please try again after 15 minutes.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== "production", // SKIP in development
});

// Rate limiter for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    error: {
      message:
        "Too many password reset attempts, please try again after an hour.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration attempts per hour
  message: {
    success: false,
    error: {
      message:
        "Too many accounts created from this IP, please try again after an hour.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
