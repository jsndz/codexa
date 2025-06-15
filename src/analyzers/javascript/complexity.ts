import Parser from "tree-sitter";

export let complexity = 0;

export function analyzeComplexity(tree: Parser.Tree) {
  complexity = 0;

  function walk(node: Parser.SyntaxNode) {
    if (
      [
        "if_statement",
        "for_statement",
        "while_statement",
        "switch_case",
        "conditional_expression",
      ].includes(node.type)
    ) {
      complexity++;
    }
    if (node.type === "binary_expression" && ["&&", "||"].includes(node.text)) {
      complexity++;
    }
    for (let i = 0; i < node.namedChildCount; i++) {
      const child = node.namedChild(i);
      if (child) {
        walk(child);
      }
    }
  }

  walk(tree.rootNode);
  return complexity;
}
