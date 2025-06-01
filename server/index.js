import http from "http";
import { createNodeMiddleware } from "@octokit/webhooks";
import app from "../app/app.js";

const port = 3000;
const host = "localhost";
const path = "/webhook";
const localWebhookUrl = `http://${host}:${port}${path}`;

const middleware = createNodeMiddleware(app.webhooks, { path });

export function startServer() {
  http.createServer(middleware).listen(port, () => {
    console.log(`Server is listening for events at: ${localWebhookUrl}`);
    console.log("Press Ctrl + C to quit.");
  });
}
