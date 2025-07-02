import { Probot } from "probot";
import { parseCode } from "./parser.js";
import { getUnusedVariables } from "./analyzers/javascript/lint.js";
import { getDeadCodeExpressions } from "./analyzers/javascript/deadcode.js";
import { getDangerousFunctions } from "./security/javascript/security.js";
import { analyzeComplexity } from "./analyzers/javascript/complexity.js";

const LINK = "http://localhost:5173/report";

export default (app: Probot) => {
  app.on("push", async (context) => {
    const owner = context.payload.repository.owner.login;
    const repo = context.payload.repository.name;
    const sha = context.payload.after;
    const installationId = context.payload.installation?.id;
    const changedFiles = context.payload.commits.flatMap((commit) => [
      ...commit.added,
      ...commit.modified,
    ]);

    const allAnnotations = [];

    for (const filePath of changedFiles) {
      if (filePath.match(/\.env(\..*)?$/)) {
        allAnnotations.push({
          path: filePath,
          start_line: 1,
          end_line: 1,
          annotation_level: "warning" as "warning",
          message: ".env file detected",
          title: "Leaked Env File",
        });
        continue;
      }

      if (!filePath.endsWith(".js") && !filePath.endsWith(".ts")) continue;

      const { data } = await context.octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: sha,
      });

      if (!("content" in data)) continue;
      const content = Buffer.from(data.content, "base64").toString("utf-8");

      const tree = parseCode(content);

      const unusedVars = getUnusedVariables(tree);
      const deadCode = getDeadCodeExpressions(tree);
      const dangerousFns = getDangerousFunctions(tree);
      const complexityScore = analyzeComplexity(tree);

      unusedVars.forEach(({ name, line }) =>
        allAnnotations.push({
          path: filePath,
          start_line: line,
          end_line: line,
          annotation_level: "warning",
          message: `Unused variable: ${name}`,
          title: "Unused Variable",
        })
      );

      deadCode.forEach(({ code, line }) =>
        allAnnotations.push({
          path: filePath,
          start_line: line,
          end_line: line,
          annotation_level: "warning",
          message: `Dead code after exit: ${code}`,
          title: "Dead Code",
        })
      );

      dangerousFns.forEach(({ name, line }) =>
        allAnnotations.push({
          path: filePath,
          start_line: line,
          end_line: line,
          annotation_level: "warning",
          message: `Dangerous usage: ${name}`,
          title: "Security Issue",
        })
      );

      allAnnotations.push({
        path: filePath,
        start_line: 1,
        end_line: 1,
        annotation_level: "notice" as "notice",
        message: `Cyclomatic complexity score: ${complexityScore}`,
        title: "Complexity",
      });
    }
    allAnnotations.push({
      path: "README.md",
      start_line: 1,
      end_line: 1,
      annotation_level: "notice" as "notice",
      message: `For AI recommendation, visit: ${LINK}?owner=${owner}&repo=${repo}&sha=${sha}&iid=${installationId}`,
      title: "AI Suggestions",
    });
    const checkRun = await context.octokit.checks.create({
      owner,
      repo,
      name: "Codexa Static Analysis",
      head_sha: sha,
      status: "in_progress",
      started_at: new Date().toISOString(),
    });

    await context.octokit.checks.update({
      owner,
      repo,
      check_run_id: checkRun.data.id,
      check_name: "Codexa Static Analysis",
      completed_at: new Date().toISOString(),
      status: "completed",
      conclusion: allAnnotations.length ? "neutral" : "success",
      output: {
        title: "Codexa Report",
        summary: `${allAnnotations.length} issue(s) found.`,
        annotations: allAnnotations.slice(0, 50),
      },
    });
  });
};
