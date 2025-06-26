import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";
import { Octokit } from "@octokit/rest";
import { ExtractedFunction } from "./types";

const parser = new Parser();
parser.setLanguage(JavaScript);

export async function extractFunctionsFromCommit(
  octokit: Octokit,
  owner: string,
  repo: string,
  sha: string
): Promise<ExtractedFunction[]> {
  const functions: ExtractedFunction[] = [];

  const commit = await octokit.repos.getCommit({ owner, repo, ref: sha });
  const changedFiles = commit.data.files || [];

  for (const file of changedFiles) {
    if (!file.filename.endsWith(".js")) continue;

    const filePath = file.filename;

    const { data: fileContentData } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: sha,
    });

    if (!("content" in fileContentData)) continue;

    const rawCode = Buffer.from(fileContentData.content, "base64").toString();

    const tree = parser.parse(rawCode);
    const root = tree.rootNode;

    root
      .descendantsOfType(["function_declaration", "method_definition"])
      .forEach((node) => {
        const nameNode = node.childForFieldName("name");
        const name = nameNode ? nameNode.text : "<anonymous>";

        functions.push({
          filePath,
          functionName: name,
          startLine: node.startPosition.row + 1,
          endLine: node.endPosition.row + 1,
          code: node.text,
        });
      });
  }

  return functions;
}
