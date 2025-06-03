import { Probot, Context } from "probot";
import fs from "fs";
import path from "path";
import os from "os";
import { getTarBall } from "../util/getTarBall";

export default (app: Probot) => {
  app.on("push", async (context: Context<"push">) => {
    console.log("Received a push event");

    const fixedPayload = {
      ...context.payload,
      commits: context.payload.commits.map((commit) => ({
        ...commit,
        added: commit.added ?? [],
        modified: commit.modified ?? [],
        removed: commit.removed ?? [],
      })),
    };

    try {
      const response = await context.octokit.request(
        "GET /repos/{owner}/{repo}/tarball/{ref}",
        {
          owner: fixedPayload.repository.owner.login,
          repo: fixedPayload.repository.name,
          ref: fixedPayload.after,
        }
      );
      const tarballUrl = response.data as string;

      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "codexa-"));
      await getTarBall(tarballUrl, tempDir);
    } catch (error: any) {
      if (error.response) {
        console.error(
          `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
        );
      }
      console.error("Unexpected error:", error);
    }
  });

  app.onError((error) => {
    if (error.name === "AggregateError") {
      console.error(`Error processing request: ${error.event}`);
    } else {
      console.error(error);
    }
  });
};
