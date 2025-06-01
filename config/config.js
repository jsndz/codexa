import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export const appId = process.env.APP_ID;
export const webhookSecret = process.env.WEBHOOK_SECRET;
export const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");
