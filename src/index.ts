import { Probot } from "probot";
import { analyzeJS } from "./analyzers/typescript/lint.js";

export default (app: Probot) => {
  app.on("push", async (context) => {
    const changedFiles = context.payload.commits.flatMap((commit) => [
      ...commit.added,
      ...commit.modified,
    ]);
    for (var i = 0; i < changedFiles.length; i++) {
      const { data } = await context.octokit.repos.getContent({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        path: changedFiles[i],
        ref: context.payload.after,
      });

      if (!("content" in data)) continue;
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      const op = analyzeJS(content);
      console.log(op);
    }
  });
};
