import Parser from "tree-sitter";
import Javascript from "tree-sitter-javascript";
var compelxity: number = 0;
const parser = new Parser();
parser.setLanguage(Javascript);

export function runAnalysis(code: string) {
  const tree = parser.parse(code);
  return getUnusedVariables(tree);
}

export function getUnusedVariables(
  tree: Parser.Tree
): { name: string; line: number }[] {
  const declaredVars: Map<string, number> = new Map();
  const usedVars: Set<string> = new Set();

  walk(tree.rootNode, declaredVars, usedVars);

  const unusedVars = [...declaredVars.entries()]
    .filter(([v]) => !usedVars.has(v))
    .map(([name, value]) => ({ name: name, line: value + 1 }));
  return unusedVars;
}

function walk(
  node: Parser.SyntaxNode,
  declaredVars: Map<string, number>,
  usedVars: Set<string>
) {
  if (
    node.type === "variable_declarator" &&
    node.firstNamedChild?.type === "identifier"
  ) {
    declaredVars.set(
      node.firstNamedChild.text,
      node.firstNamedChild.startPosition.row
    );
  }

  if (
    node.type === "identifier" &&
    node.parent?.type !== "variable_declarator"
  ) {
    usedVars.add(node.text);
  }
  if (
    [
      "if_statement",
      "for_statement",
      "while_statement",
      "switch_case",
      "conditional_expression",
    ].includes(node.type)
  ) {
    compelxity++;
  }
  if (node.type === "binary_expression" && ["&&", "||"].includes(node.text)) {
    compelxity++;
  }

  for (let i = 0; i < node.namedChildCount; i++) {
    walk(node.namedChild(i)!, declaredVars, usedVars);
  }
}
