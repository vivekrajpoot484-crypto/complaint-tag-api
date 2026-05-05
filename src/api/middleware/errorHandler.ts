import { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware.
 * Catches all errors and returns a consistent JSON response.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "An internal server error occurred.";

  // Log error for internal tracking (could be enhanced with a real logger)
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  res.status(status).json({
    error: message,
    status: status
  });
};
