const dangerousPatterns = [
  { pattern: /\beval\s*\(/g, name: "eval()" },
  { pattern: /\bnew\s+Function\s*\(/g, name: "new Function()" },
  { pattern: /\bchild_process\.exec\s*\(/g, name: "child_process.exec()" },
  { pattern: /\bsetTimeout\s*\(\s*["'`]/g, name: "setTimeout with string" },
];
