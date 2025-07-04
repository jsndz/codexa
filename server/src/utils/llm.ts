import { ExtractedFunction } from "./types";

export async function llmAnalysis(data: ExtractedFunction[]) {
  const prompt = `You're an expert developer. Here are several JavaScript functions.

Only suggest improvements if absolutely necessary (e.g., improve readability, fix issues, or simplify logic).
If a function is already good, return the exact same code.

Each item is in this format:
{
  "functionName": "name",
  "code": "code_string"
}

👉 Your job:
Analyze each function and return ONLY an array like this:
[
  {
    "functionName": "name",
    "newCode": "updated code string",
    "explanation": "explanation of what was changed and why"
  }
]

Return valid JSON only.
Here is the input:
${JSON.stringify(data, null, 2)}
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "codellama:7b-instruct",
      prompt,
      stream: false,
    }),
  });

  const json = await response.json();
  const text = json.response;
  console.log(text);

  const match = text.match(/\[\s*{[^]*?}\s*]/);

  if (!match) {
    throw new Error("Could not extract JSON from LLM response.");
  }

  try {
    const suggestions = JSON.parse(match[0]);
    console.log(suggestions);

    return suggestions;
  } catch (err) {
    console.error("Failed to parse LLM JSON:", err);
    throw err;
  }
}
