import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

export function notFoundMiddleware(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorMiddleware(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details || null,
    ...(env.nodeEnv !== "production" && { stack: err.stack }),
  });
}
