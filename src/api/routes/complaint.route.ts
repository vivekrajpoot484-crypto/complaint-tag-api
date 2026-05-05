import { Router, Request, Response, NextFunction } from "express";
import { classifyComplaint, ComplaintInput } from "../../services/ai/complaintClassifier";
import { validateAndSanitizeResponse } from "../../services/validation/responseValidator";

const router = Router();

/**
 * POST /api/tag-complaint
 * 
 * Analyzes a customer complaint message using AI and returns structured metadata.
 */
router.post("/tag-complaint", async (req: Request, res: Response, next: NextFunction) => {
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

    const input: ComplaintInput = {
      message,
      business_context,
      language
    };

    // Call AI service function
    const rawAnalysis = await classifyComplaint(input);

    // Pass through response validator for production hardening
    const sanitizedAnalysis = validateAndSanitizeResponse(rawAnalysis);

    // Return sanitized JSON response
    res.json(sanitizedAnalysis);
  } catch (error) {
    // Forward error to global error handler
    next(error);
  }
});

export default router;
