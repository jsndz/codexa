import Parser from "tree-sitter";
import Javascript from "tree-sitter-javascript";

const parser = new Parser();
parser.setLanguage(Javascript);

export function runSecurityAnalysis(code: string) {
  const tree = parser.parse(code);
  return getDangerousFunction(tree);
}

export function getDangerousFunction(
  tree: Parser.Tree
): { name: string; line: number }[] {
  const results: { name: string; line: number }[] = [];

  walk(tree.rootNode, results);

  return results;
}

function walk(
  node: Parser.SyntaxNode,
  matches: { name: string; line: number }[]
) {
  if (
    node.type === "call_expression" &&
    node.firstNamedChild?.type === "identifier" &&
    node.firstNamedChild.text === "eval"
  ) {
    const name = node.firstNamedChild.text;
    if (["eval", "execSync", "exec", "Function"].includes(name)) {
      matches.push({
        name,
        line: node.startPosition.row + 1,
      });
    }
  }

  for (let i = 0; i < node.namedChildCount; i++) {
    walk(node.namedChild(i)!, matches);
  }
}
