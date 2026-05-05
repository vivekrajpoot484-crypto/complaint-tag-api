import { Router, Request, Response } from "express";
import twilio from "twilio";
import { classifyComplaint } from "../../services/ai/complaintClassifier";

const router = Router();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

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
 */
router.post("/whatsapp", async (req: Request, res: Response) => {
  try {
    // Twilio sends data as application/x-www-form-urlencoded
    const { Body, From } = req.body;

    if (!Body || !From) {
      console.error("Missing Body or From in Twilio payload");
      res.status(200).send("OK"); // Always return 200 to Twilio
      return;
    }

    // 1. Classify the complaint
    const analysis = await classifyComplaint({ message: Body });

    // 2. Generate the auto-reply
    const replyMessage = generateReply(analysis);

    // 3. Send reply back using Twilio API
    await client.messages.create({
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      to: From,
      body: replyMessage
    });

    console.log(`WhatsApp reply sent to ${From}`);
    
  } catch (error) {
    console.error("Error handling WhatsApp webhook:", error);
  } finally {
    // Always return 200 to Twilio to avoid retries
    res.status(200).send("OK");
  }
});

export default router;
