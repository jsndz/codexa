import fs from "fs";
import path from "path";
import os from "os";
import { getTarBall } from "../util/getTarBall";
import { Octokit } from "@octokit/core";
import { PushEvent } from "@octokit/webhooks-types";
const messageForNewPRs =
  "Thanks for opening a new PR! Please follow our contributing guidelines to make your PR easier to review.";

export const handlePushEvent = async ({
  octokit,
  payload,
}: {
  octokit: Octokit;
  payload: PushEvent;
}): Promise<void> => {
  console.log("Received a push request event");

  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/tarball/{ref}",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        ref: payload.after,
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
};
