import { Router, Request, Response } from "express";
import twilio, { Twilio } from "twilio";
import { classifyComplaint } from "../../services/ai/complaintClassifier";

const router = Router();

/**
 * Lazy initialization of the Twilio client.
 * This ensures that the Twilio module logic is NOT executed at import time,
 * preventing startup crashes if environment variables are missing.
 */
let twilioClient: Twilio | null = null;

/**
 * Safely retrieves the Twilio client.
 * Validates environment variables only when needed.
 */
function getTwilioClient(): Twilio | null {
  // If already initialized (even as null), return the cached state
  if (twilioClient) return twilioClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  // Validate presence
  if (!accountSid || !authToken) {
    console.warn("[Twilio] Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN. WhatsApp integration will be disabled.");
    return null;
  }

  // Validate format (AC... is required for Twilio Account SIDs)
  if (!accountSid.startsWith("AC")) {
    console.warn("[Twilio] Invalid TWILIO_ACCOUNT_SID format (must start with 'AC'). WhatsApp integration will be disabled.");
    return null;
  }

  try {
    twilioClient = twilio(accountSid, authToken);
    console.log("[Twilio] Client initialized successfully.");
    return twilioClient;
  } catch (error) {
    console.error("[Twilio] Failed to initialize client:", error);
    return null;
  }
}

/**
 * Generates a human-like reply based on the AI analysis results.
 */
function generateReply(analysis: any): string {
  const { category, urgency_score, reply_tone } = analysis;
  
  let intro = "";
  if (reply_tone === "apologetic") {
    intro = "We are very sorry to hear about this issue. ";
  } else if (reply_tone === "urgent") {
    intro = "We have prioritized your request. ";
  } else {
    intro = "Thank you for reaching out to us. ";
  }

  const categoryMap: Record<string, string> = {
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
 * This route is safe and will not crash the app even if Twilio is unconfigured.
 */
router.post("/whatsapp", async (req: Request, res: Response) => {
  try {
    const { Body, From } = req.body;

    if (!Body || !From) {
      console.error("[WhatsApp Webhook] Missing Body or From in Twilio payload");
      return res.status(200).send("OK"); // Acknowledge to Twilio to stop retries
    }

    // 1. Classify with fallback safety
    let analysis;
    try {
      analysis = await classifyComplaint({ message: Body });
    } catch (aiError) {
      console.error("[WhatsApp Webhook] AI service failed, using fallback:", aiError);
      analysis = {
        category: "other",
        urgency_score: 50,
        reply_tone: "neutral",
        summary: Body,
        confidence: 0.5
      };
    }

    // 2. Prepare reply
    const replyMessage = generateReply(analysis);

    // 3. Attempt to send via Twilio
    const client = getTwilioClient();
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (client && whatsappNumber) {
      await client.messages.create({
        from: `whatsapp:${whatsappNumber}`,
        to: From,
        body: replyMessage
      });
      console.log(`[WhatsApp Webhook] Reply sent successfully to ${From}`);
    } else {
      console.warn(`[WhatsApp Webhook] Could not send reply to ${From}: Twilio client or WhatsApp number not configured.`);
    }
    
  } catch (error) {
    console.error("[WhatsApp Webhook] Unexpected error handling request:", error);
  } finally {
    // Crucial: Twilio webhooks should almost always return 200 OK
    res.status(200).send("OK");
  }
});

export default router;
