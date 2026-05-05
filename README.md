# 🧠 Complaint Tagging API (AI Customer Support Classifier)

A production-ready AI-powered backend API that automatically analyzes customer complaints and classifies them into structured categories like refund, delay, product issue, rude behavior, and more. It also provides urgency scoring, tone detection, and AI-generated summaries for support automation systems.

---

## 🚀 Live API

https://your-render-app.onrender.com/api/v1/tag-complaint

## 📌 What this project does

This API helps businesses automate customer support by:

- Classifying complaints into categories
- Detecting urgency level (0–100)
- Identifying response tone (apologetic, urgent, neutral)
- Generating short complaint summaries
- Standardizing support workflows for SaaS and e-commerce platforms

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- TypeScript
- Custom AI classification engine
- Render (Backend Hosting)
- RapidAPI (Marketplace distribution)

---

## 📁 Project Structure


src/
├── api/
│ ├── middleware/
│ │ ├── apiKeyAuth.ts
│ │ ├── rateLimiter.ts
│ │ ├── errorHandler.ts
│ │ └── requestId.ts
│ ├── routes/
│ │ ├── complaint.route.ts
│ │ └── whatsapp.route.ts
│ ├── services/
│ │ ├── ai/
│ │ │ ├── complaintClassifier.ts
│ │ │ └── utils/
│ │ │ ├── app.ts
│ │ │ └── response.ts
│ │ └── validation/
│ │ └── responseValidator.ts
├── server.ts



---

## 📡 API Endpoint

### POST `/api/v1/tag-complaint`

### Headers

```json
{
  "x-api-key": "YOUR_API_KEY",
  "Content-Type": "application/json"
}

OR (RapidAPI)

x-rapidapi-key: your_key
x-rapidapi-host: your_host


📥 Request Body
{
  "message": "My order is delayed, I want a refund",
  "business_context": "ecommerce",
  "language": "en"
}

📤 Success Response
{
  "success": true,
  "data": {
    "category": "refund",
    "urgency_score": 85,
    "reply_tone": "apologetic",
    "summary": "Customer is requesting a refund due to delay.",
    "confidence": 0.98
  },
  "error": null,
  "meta": {
    "request_id": "uuid",
    "timestamp": "2026-05-05T12:00:00Z",
    "version": "v1"
  }
}

❌ Error Response
{
  "success": false,
  "data": null,
  "error": {
    "message": "Missing or invalid 'message' field",
    "code": 400
  },
  "meta": {
    "request_id": "uuid",
    "timestamp": "2026-05-05T12:00:00Z",
    "version": "v1"
  }
}

🔐 Authentication

This API requires an API key.

Header options:
x-api-key: YOUR_API_KEY

OR

Authorization: Bearer YOUR_API_KEY

OR (RapidAPI)

x-rapidapi-key: YOUR_KEY

🚦 Rate Limiting
30 requests per minute (default)
Returns 429 Too Many Requests when exceeded
🧠 Core Features
AI complaint classification engine
Structured JSON output
Request validation layer
Global error handling
API key security layer
Rate limiting protection
Request ID tracking
Production-safe architecture
WhatsApp webhook integration (optional module)

🌐 Deployment (Render)
Build Command
npm run build
Start Command
npm start
Environment Variables
PORT=10000
API_KEY=your_api_key

📡 Architecture Flow
Client → RapidAPI → Render API → AI Classifier → Response
💰 Use Cases
SaaS customer support automation
E-commerce complaint routing
CRM ticket classification
WhatsApp support bots
Helpdesk automation systems

🧪 Local Setup
- git clone https://github.com/your-username/complaint-tag-api.git
- cd complaint-tag-api
- npm install
- npm run build
- npm start

start
🔥 Future Improvements
- Analytics dashboard
- Multi-language support
- Webhook automation builder
- Slack/WhatsApp integrations
- SaaS UI dashboard
- Usage billing system

## 📊 Production Readiness

This API is designed for real-world deployment and monetization with:

- Stateless architecture (scales horizontally)
- Middleware-based security system
- Standardized response contract
- External API marketplace compatibility (RapidAPI)
- Separation of concerns (routes, services, middleware)

---

## 🔌 Integrations

### RapidAPI
- Fully compatible endpoint structure
- Standard headers support (`x-rapidapi-key`)
- Marketplace-ready response format

### Render Deployment
- Cloud-hosted Node.js runtime
- Auto-build from GitHub
- Environment-based configuration

---

## 🧩 Middleware Overview

### API Key Security
Blocks unauthorized access using:
- `x-api-key`
- `Authorization: Bearer`
- `x-rapidapi-key`

---

### Rate Limiter
- 30 requests/min per IP
- Prevents abuse and scraping
- Returns structured 429 response

---

### Request ID Tracking
- Every request gets a UUID
- Used for debugging and logs
- Included in all responses

---

### Global Error Handler
- Catches runtime failures
- Prevents server crashes
- Returns standardized error format

---

## 🧠 AI Engine Behavior

The classification engine returns:

| Field | Description |
|------|------------|
| category | Complaint type |
| urgency_score | Priority level (0–100) |
| reply_tone | Suggested support tone |
| summary | Short explanation |
| confidence | Model confidence score |

---

## 📦 Example Use Case Flow

### Input
