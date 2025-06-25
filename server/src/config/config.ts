import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PORT = process.env.PORT;
export const APP_ID = process.env.APP_ID;
export const PRIVATE_KEY = readFileSync(
  path.resolve(__dirname, "../../" + process.env.PRIVATE_KEY_PATH)
).toString();

export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
