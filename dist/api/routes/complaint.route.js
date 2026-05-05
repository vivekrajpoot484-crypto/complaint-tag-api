"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaintClassifier_1 = require("../../services/ai/complaintClassifier");
const responseValidator_1 = require("../../services/validation/responseValidator");
const router = (0, express_1.Router)();
/**
 * POST /api/tag-complaint
 *
 * Analyzes a customer complaint message using AI and returns structured metadata.
 */
router.post("/tag-complaint", async (req, res, next) => {
    try {
        const { message, business_context, language } = req.body;
        // Basic validation
        if (!message || typeof message !== "string") {
            res.status(400).json({
                error: "Missing or invalid 'message' field. A string is required.",
                status: 400
            });
            return;
        }
        const input = {
            message,
            business_context,
            language
        };
        // Call AI service function
        const rawAnalysis = await (0, complaintClassifier_1.classifyComplaint)(input);
        // Pass through response validator for production hardening
        const sanitizedAnalysis = (0, responseValidator_1.validateAndSanitizeResponse)(rawAnalysis);
        // Return sanitized JSON response
        res.json(sanitizedAnalysis);
    }
    catch (error) {
        // Forward error to global error handler
        next(error);
    }
});
exports.default = router;
