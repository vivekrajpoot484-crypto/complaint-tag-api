import express from "express";
import cors from "cors";
import complaintRoute from "../../../routes/complaint.route";
import whatsappRoute from "../../../routes/whatsapp.route";
import { logger } from "../../../middleware/logger";
import { errorHandler } from "../../../middleware/errorHandler";

/**
 * Creates and configures the Express application.
 * All route registrations are safe as they do not perform side effects at import time.
 */
function createApp() {
  const app = express();

  // 1. Global Middleware
  app.use(logger);
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. Health Check (Basic heartbeat for Render/Deployment)
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      service: "complaint-tag-api",
      timestamp: new Date().toISOString()
    });
  });

  // 3. API Routes
  // app.ts
 // TEMP FIX: disable whatsapp route for deployment stability
 // import whatsappRoute from "../../../routes/whatsapp.route";
 // app.use("/webhook", whatsappRoute);
  // Note: These routes are safe to register even if underlying services (like Twilio) are unconfigured.
  app.use("/api", complaintRoute);
  app.use("/webhook", whatsappRoute);

  // 4. Global Error Handling (Must be registered last)
  app.use(errorHandler);

  return app;
}

// Export a singleton instance for standard usage
export const app = createApp();

export default app;
