import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

export const PORT = process.env.PORT;
export const APP_ID = process.env.APP_ID;
export const PRIVATE_KEY = fs
  .readFileSync(
    path.resolve(__dirname, "../../" + process.env.PRIVATE_KEY_PATH!)
  )
  .toString();

export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
