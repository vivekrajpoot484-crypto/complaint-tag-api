import * as dotenv from "dotenv";
dotenv.config();

import app from "./api/services/ai/utils/app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});