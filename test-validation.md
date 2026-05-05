# Test Validation Guide: Complaint Tag API

This document outlines the procedure and criteria for validating the `complaint-tag-api` endpoint.

## How to Test the Endpoint

1. **Start the Server**:
   Ensure the API is running (usually `npm start` or `npm run dev`).
2. **Postman**:
   Import `complaint-tag-api.postman_collection.json` into Postman.
3. **Execute Requests**:
   Run the "Tag Complaint" request using the provided examples or custom WhatsApp-style messages.
4. **Endpoint**: `POST http://localhost:3000/api/tag-complaint`

## Expected Response Format

The response must always be a JSON object with the following structure:

```json
{
  "category": "refund | delay | rude_behavior | product_issue | other",
  "urgency_score": number (0-100),
  "reply_tone": "calm | apologetic | urgent | neutral | firm",
  "summary": "string",
  "confidence": number (0-1)
}
```

---

## Validation Checklist

### 1. Category Correctness
- [ ] **Refund**: Triggered by keywords like "money back", "refund", "return", "chargeback".
- [ ] **Delay**: Triggered by "where is my order", "late", "hasn't arrived", "stuck in transit".
- [ ] **Rude Behavior**: Triggered by "disrespectful", "rude", "ignored me", "bad attitude".
- [ ] **Product Issue**: Triggered by "broken", "crashing", "faulty", "not working", "shattered".
- [ ] **Other**: Generic feedback or inquiries that don't fit the above.

### 2. Urgency Score Behavior
- [ ] **High (80-100)**: Used for broken products, immediate refund demands, or time-sensitive delays (e.g., "birthday tomorrow").
- [ ] **Medium (40-79)**: Standard delays or minor product defects.
- [ ] **Low (0-39)**: General feedback or minor complaints without immediate time pressure.
- [ ] **Hardening Check**: Ensure score never exceeds 100 or drops below 0.

### 3. Reply Tone Correctness
- [ ] **Apologetic**: For product failures or rude staff.
- [ ] **Urgent**: For significant delays or critical errors.
- [ ] **Firm**: For policy-related matters or repeated complaints.
- [ ] **Calm/Neutral**: For general inquiries or low-urgency feedback.

### 4. Confidence Stability
- [ ] **Range**: Must always be a float between 0.0 and 1.0.
- [ ] **Accuracy**: High confidence (>0.85) for clear complaints. Lower confidence for ambiguous or very short messages.

### 5. Summary Quality
- [ ] **Conciseness**: Should be 1-2 sentences maximum.
- [ ] **Normalization**: Should strip out emojis and slang while retaining the core grievance (e.g., "broken shoes" instead of "kicks are busted 😡").

---

## Error Handling Validation
- [ ] **Missing Message**: Sending `{}` or `{"message": ""}` should return status `400`.
- [ ] **Invalid API Key**: If the Gemini API key is missing, should return status `500` with a clear error message.
- [ ] **Large Payloads**: Sending extremely long text should be handled gracefully by the AI service.
