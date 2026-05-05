"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const complaint_route_1 = __importDefault(require("../../../routes/complaint.route"));
const whatsapp_route_1 = __importDefault(require("../../../routes/whatsapp.route"));
const logger_1 = require("../../../middleware/logger");
const errorHandler_1 = require("../../../middleware/errorHandler");
const app = (0, express_1.default)();
app.use(logger_1.logger);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "complaint-tag-api"
    });
});
app.use("/api", complaint_route_1.default);
app.use("/webhook", whatsapp_route_1.default);
// Error handler MUST be last
app.use(errorHandler_1.errorHandler);
exports.default = app;
