import { ESLint } from "eslint";

export async function analyzeJS(code: string) {
  const eslint = new ESLint({});
  const results = await eslint.lintText(code);
  return results.flatMap((result) => result.messages);
}
