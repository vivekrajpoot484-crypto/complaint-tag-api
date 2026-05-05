/**
 * Input structure for complaint classification
 */
export interface ComplaintInput {
  message: string;
  business_context?: string;
  language?: string;
}

/**
 * Output structure for complaint analysis
 */
export interface ComplaintAnalysis {
  category: "refund" | "delay" | "rude_behavior" | "product_issue" | "other";
  urgency_score: number;
  reply_tone: "calm" | "apologetic" | "urgent" | "neutral" | "firm";
  summary: string;
  confidence: number;
}

/**
 * Classifies a customer complaint using a deterministic fallback classifier.
 * 
 * @param input - The customer message and optional context
 * @returns A promise that resolves to the analyzed complaint data
 */
export async function classifyComplaint(input: ComplaintInput): Promise<ComplaintAnalysis> {
  const message = input.message.toLowerCase();

  let category: ComplaintAnalysis["category"] = "other";
  let urgency = 40;
  let tone: ComplaintAnalysis["reply_tone"] = "neutral";

  if (message.includes("refund") || message.includes("money back")) {
    category = "refund";
    urgency = 85;
    tone = "urgent";
  } else if (message.includes("late") || message.includes("delay")) {
    category = "delay";
    urgency = 70;
    tone = "apologetic";
  } else if (message.includes("rude") || message.includes("ignored")) {
    category = "rude_behavior";
    urgency = 75;
    tone = "firm";
  } else if (
    message.includes("broken") ||
    message.includes("not working") ||
    message.includes("crashing")
  ) {
    category = "product_issue";
    urgency = 80;
    tone = "apologetic";
  }

  return {
    category,
    urgency_score: urgency,
    reply_tone: tone,
    summary: input.message.slice(0, 80),
    confidence: 0.85
  };
}
