// import { Octokit } from "@octokit/rest";

// export async function createAutoPR(
//   octokit: Octokit,
//   payload: Payload
// ): Promise<void> {
//   const { owner, repo, sha, files } = payload;

//   const filePath = files[0].filePath;
//   const { data: fileData } = await octokit.repos.getContent({
//     owner,
//     repo,
//     path: filePath,
//     ref: sha,
//   });

//   const fileContent = atob(fileData.content);
//   const lines = fileContent.split("\n");

//   for (const change of files) {
//     const { startLine, endLine, newCode } = change;
//     const newLines = newCode.split("\n");
//     lines.splice(startLine - 1, endLine - startLine + 1, ...newLines);
//   }

//   const updatedContent = lines.join("\n");

//   const branchName = `codexa-pr-${Date.now()}`;
//   await octokit.git.createRef({
//     owner,
//     repo,
//     ref: `refs/heads/${branchName}`,
//     sha,
//   });

//   await octokit.repos.createOrUpdateFileContents({
//     owner,
//     repo,
//     path: filePath,
//     message: `Apply automated changes to ${filePath}`,
//     content: btoa(updatedContent),
//     branch: branchName,
//   });

//   const prBody = files
//     .map((file) => `- **${file.functionName}**: ${file.explanation}`)
//     .join("\n");

//   const { data: pr } = await octokit.pulls.create({
//     owner,
//     repo,
//     title: `Automated changes to ${filePath}`,
//     head: branchName,
//     base: "main",
//     body: `### Summary of Changes:\n\n${prBody}`,
//   });

//   return pr.html_url;
// }
