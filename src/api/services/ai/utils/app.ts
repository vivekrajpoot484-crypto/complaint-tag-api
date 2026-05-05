import express from "express";
import cors from "cors";
import complaintRoute from "../../../routes/complaint.route";
import whatsappRoute from "../../../routes/whatsapp.route";
import { logger } from "../../../middleware/logger";
import { errorHandler } from "../../../middleware/errorHandler";

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "complaint-tag-api"
  });
});

app.use("/api", complaintRoute);
app.use("/webhook", whatsappRoute);

// Error handler MUST be last
app.use(errorHandler);

export default app;
