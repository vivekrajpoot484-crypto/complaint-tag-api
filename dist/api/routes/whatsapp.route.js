"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const twilio_1 = __importDefault(require("twilio"));
const complaintClassifier_1 = require("../../services/ai/complaintClassifier");
const router = (0, express_1.Router)();
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
const client = (0, twilio_1.default)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
/**
 * Generates a human-like reply based on the AI analysis results.
 */
function generateReply(analysis) {
    const { category, urgency_score, reply_tone } = analysis;
    let intro = "";
    if (reply_tone === "apologetic") {
        intro = "We are very sorry to hear about this issue. ";
    }
    else if (reply_tone === "urgent") {
        intro = "We have prioritized your request. ";
    }
    else {
        intro = "Thank you for reaching out to us. ";
    }
    const categoryMap = {
        refund: "processing your refund request",
        delay: "investigating the delay",
        rude_behavior: "addressing the behavior reported",
        product_issue: "looking into the product concern",
        other: "reviewing your message"
    };
    const action = categoryMap[category] || "reviewing your request";
    const urgencyMsg = urgency_score > 70 ? " Given the urgency, a specialist will contact you shortly." : "";
    return `${intro}Our team is currently ${action}.${urgencyMsg}`;
}
/**
 * POST /webhook/whatsapp
 * Handles incoming WhatsApp messages from Twilio.
 */
router.post("/whatsapp", async (req, res) => {
    try {
        // Twilio sends data as application/x-www-form-urlencoded
        const { Body, From } = req.body;
        if (!Body || !From) {
            console.error("Missing Body or From in Twilio payload");
            res.status(200).send("OK"); // Always return 200 to Twilio
            return;
        }
        // 1. Classify the complaint
        const analysis = await (0, complaintClassifier_1.classifyComplaint)({ message: Body });
        // 2. Generate the auto-reply
        const replyMessage = generateReply(analysis);
        // 3. Send reply back using Twilio API
        await client.messages.create({
            from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
            to: From,
            body: replyMessage
        });
        console.log(`WhatsApp reply sent to ${From}`);
    }
    catch (error) {
        console.error("Error handling WhatsApp webhook:", error);
    }
    finally {
        // Always return 200 to Twilio to avoid retries
        res.status(200).send("OK");
    }
});
exports.default = router;
