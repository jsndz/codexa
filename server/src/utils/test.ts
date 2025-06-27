import { llmAnalysis } from "./llm.js";
import { ExtractedFunction } from "./types.js";

const code: ExtractedFunction[] = [
  {
    filePath: "index.js",
    functionName: "sayHello",
    startLine: 3,
    endLine: 5,
    code: "function sayHello(name) {\n  return `Hello, name`;\n}",
  },
  {
    filePath: "index.js",
    functionName: "add",
    startLine: 7,
    endLine: 9,
    code: "function add(a, b) {\n  return a & b;\n}",
  },
  {
    filePath: "index.js",
    functionName: "multiply",
    startLine: 12,
    endLine: 14,
    code: "multiply(x, y) {\n    return x * y;\n  }",
  },
  {
    filePath: "index.js",
    functionName: "divide",
    startLine: 16,
    endLine: 19,
    code:
      "divide(x, y) {\n" +
      '    if (y === 0) throw new Error("error");\n' +
      "    return x / y;\n" +
      "  }",
  },
];

llmAnalysis(code);
