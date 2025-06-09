import Parser from "tree-sitter";
import Javascript from "tree-sitter-javascript";

const parser = new Parser();
parser.setLanguage(Javascript);

export function runAnalysis(code: string) {
  const tree = parser.parse(code);
  console.log(getUnusedVariables(tree));
}

export function getUnusedVariables(tree: Parser.Tree): string[] {
  const declaredVars: Set<string> = new Set();
  const usedVars: Set<string> = new Set();

  walk(tree.rootNode, declaredVars, usedVars);

  const unusedVars = [...declaredVars].filter((v) => !usedVars.has(v));
  return unusedVars;
}

function walk(
  node: Parser.SyntaxNode,
  declaredVars: Set<string>,
  usedVars: Set<string>
) {
  if (
    node.type === "variable_declarator" &&
    node.firstNamedChild?.type === "identifier"
  ) {
    declaredVars.add(node.firstNamedChild.text);
  }

  if (
    node.type === "identifier" &&
    node.parent?.type !== "variable_declarator"
  ) {
    usedVars.add(node.text);
  }

  for (let i = 0; i < node.namedChildCount; i++) {
    walk(node.namedChild(i)!, declaredVars, usedVars);
  }
}
