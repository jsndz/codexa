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
    "newCode": "updated code string"
  }
]

Do not include any explanation. Only return valid JSON.

Here is the input:
${JSON.stringify(data, null, 2)}
`;
  console.log(prompt);

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
  console.log("JSON:", json);

  return;
}
