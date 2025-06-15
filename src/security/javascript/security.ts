import { SyntaxNode, Tree } from "tree-sitter";

export function getDangerousFunctions(tree: Tree) {
  const results: { name: string; line: number }[] = [];
  function walk(node: SyntaxNode) {
    if (
      node.type === "call_expression" &&
      node.firstNamedChild?.type === "identifier"
    ) {
      const name = node.firstNamedChild.text;
      if (["eval", "execSync", "exec", "Function"].includes(name)) {
        results.push({ name, line: node.startPosition.row + 1 });
      }
    }
    for (let i = 0; i < node.namedChildCount; i++) {
      const child = node.namedChild(i);
      if (child) {
        walk(child);
      }
    }
  }
  walk(tree.rootNode);
  return results;
}
