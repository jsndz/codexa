import express from "express";
import { Probot } from "probot";
import probotApp from "./app/app";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

const probot = new Probot({
  appId: process.env.APP_ID!,
  privateKey: process.env.PRIVATE_KEY!,
  secret: process.env.WEBHOOK_SECRET!,
});

probot.load(probotApp);

app.get("/", (_, res) => {
  res.send("Codexa GitHub App is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
