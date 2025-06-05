import { Probot } from "probot";

export default (app: Probot) => {
  app.on("push", async (context) => {
    console.log(`Received a push event for ${context.payload}`);
  });

};
