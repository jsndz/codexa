import { Probot } from "probot";
import { runAnalysis } from "./analyzers/javascript/lint.js";

export default (app: Probot) => {
  app.on("push", async (context) => {
    const owner = context.payload.repository.owner.login;
    const repo = context.payload.repository.name;
    const sha = context.payload.after;
    const changedFiles = context.payload.commits.flatMap((commit) => [
      ...commit.added,
      ...commit.modified,
    ]);
    const allAnnotations: any = [];
    for (let i = 0; i < changedFiles.length; i++) {
      const filePath = changedFiles[i];

      if (!filePath.endsWith(".js") && !filePath.endsWith(".ts")) continue;
      if (filePath.match(/\.env(\..*)?$/)) {
        const envannotation = {
          path: filePath,
          annotation_level: "warning" as "warning",
          message: `.env file found: `,
          title: "Unused Variable",
        };
        allAnnotations.push(envannotation);
      }

      const { data } = await context.octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: sha,
      });
      if (!("content" in data)) continue;
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      const op = runAnalysis(content);
      const annotations = op.map((item) => ({
        path: filePath,
        start_line: item.line,
        end_line: item.line,
        annotation_level: "warning" as "warning",
        message: `Unused variable: ${item.name}`,
        title: "Unused Variable",
      }));

      allAnnotations.push(...annotations);
    }
    const checkRun = await context.octokit.checks.create({
      owner,
      repo,
      name: "Codexa Static Analysis",
      head_sha: sha,
      status: "in_progress",
      started_at: new Date().toISOString(),
    });

    const checkRunId = checkRun.data.id;

    await context.octokit.checks.update({
      owner,
      repo,
      check_run_id: checkRunId,
      check_name: "Codexa Static Analysis",
      completed_at: new Date().toISOString(),
      status: "completed",
      conclusion: allAnnotations.length ? "neutral" : "success",
      output: {
        title: "Codexa Report",
        summary: `${allAnnotations.length} unused variable(s) found.`,
        annotations: allAnnotations,
      },
    });
  });
};
