"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
/**
 * Global error handling middleware.
 * Catches all errors and returns a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "An internal server error occurred.";
    // Log error for internal tracking (could be enhanced with a real logger)
    console.error(`[Error] ${req.method} ${req.url}:`, err);
    res.status(status).json({
        error: message,
        status: status
    });
};
exports.errorHandler = errorHandler;
