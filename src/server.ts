/**
 * Production Server Entry Point
 * 
 * This file is designed for maximum stability during deployment.
 * It ensures environment variables are loaded before any application logic,
 * and handles startup errors gracefully.
 */

import * as dotenv from "dotenv";
import path from "path";


// 1. Load environment variables immediately
dotenv.config();

// (Optional) Explicitly load from root if needed, but dotenv.config() usually handles it
// dotenv.config({ path: path.join(__dirname, "../.env") });

import { app } from "./api/services/ai/utils/app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

/**
 * Start the server
 */
function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`[Server] Initialization complete.`);
      console.log(`[Server] Running on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("[Server] Critical failure during startup:", error);
    process.exit(1);
  }
}

// Handle unhandled rejections globally
process.on("unhandledRejection", (reason, promise) => {
  console.error("[Server] Unhandled Rejection at:", promise, "reason:", reason);
});

startServer();
