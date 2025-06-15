import Parser from "tree-sitter";

export function getUnusedVariables(tree: Parser.Tree) {
  const declaredVars = new Map();
  const usedVars = new Set();

  function walk(node: Parser.SyntaxNode) {
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
    for (let i = 0; i < node.namedChildCount; i++) {
      const child = node.namedChild(i);
      if (child) {
        walk(child);
      }
    }
  }

  walk(tree.rootNode);

  return [...declaredVars.entries()]
    .filter(([v]) => !usedVars.has(v))
    .map(([name, value]) => ({ name: name, line: value + 1 }));
}
