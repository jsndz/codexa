import { App } from "octokit";
import { appId, privateKey, webhookSecret } from "../config/config.js";
import { handlePullRequestOpened } from "./webhooks.js";

const app = new App({
  appId,
  privateKey,
  webhooks: {
    secret: webhookSecret,
  },
});

app.webhooks.on("pull_request.opened", handlePullRequestOpened);

app.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

export default app;
