"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const complaintClassifier_1 = require("../services/ai/complaintClassifier");
async function runTests() {
    const testCases = [
        {
            message: "I want a refund for my broken item.",
            business_context: "Retail",
        },
        {
            message: "Your delivery is very late, what a delay!",
        },
        {
            message: "The support agent was very rude to me.",
        },
        {
            message: "The app is crashing and not working.",
        },
        {
            message: "Hello, I have a general question.",
        }
    ];
    console.log("Testing Deterministic Fallback Classifier\n");
    for (const input of testCases) {
        console.log(`Input: "${input.message}"`);
        try {
            const result = await (0, complaintClassifier_1.classifyComplaint)(input);
            console.log("Result:", JSON.stringify(result, null, 2));
        }
        catch (error) {
            console.error("Test failed:", error);
        }
        console.log("-".repeat(30));
    }
}
runTests();
