"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndSanitizeResponse = validateAndSanitizeResponse;
const VALID_CATEGORIES = ["refund", "delay", "rude_behavior", "product_issue", "other"];
const VALID_TONES = ["calm", "apologetic", "urgent", "neutral", "firm"];
/**
 * Validates and sanitizes the AI output to ensure it matches the expected schema and constraints.
 */
function validateAndSanitizeResponse(data) {
    // 1. Validate category
    let category = "other";
    if (data.category && VALID_CATEGORIES.includes(data.category)) {
        category = data.category;
    }
    // 2. Validate and clamp urgency_score (0-100)
    let urgency_score = typeof data.urgency_score === "number" ? data.urgency_score : 50;
    urgency_score = Math.max(0, Math.min(100, Math.round(urgency_score)));
    // 3. Validate reply_tone
    let reply_tone = "neutral";
    if (data.reply_tone && VALID_TONES.includes(data.reply_tone)) {
        reply_tone = data.reply_tone;
    }
    // 4. Validate and clamp confidence (0-1)
    let confidence = typeof data.confidence === "number" ? data.confidence : 0.5;
    confidence = Math.max(0, Math.min(1, confidence));
    // 5. Sanitize summary
    const summary = typeof data.summary === "string" ? data.summary.trim() : "No summary provided.";
    return {
        category,
        urgency_score,
        reply_tone,
        summary,
        confidence
    };
}
