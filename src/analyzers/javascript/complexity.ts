import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";

const parser = new Parser();
parser.setLanguage(JavaScript);

const EXIT_STATEMENTS = new Set([
  "return_statement",
  "throw_statement",
  "break_statement",
  "continue_statement",
]);

export function getDeadCodeExpressions(
  tree: Parser.Tree
): { line: number; code: string }[] {
  const deadStatements: { line: number; code: string }[] = [];

  function walk(node: Parser.SyntaxNode) {
    if (node.type === "block") {
      let foundExit = false;

      for (const child of node.namedChildren) {
        if (foundExit) {
          deadStatements.push({
            line: child.startPosition.row + 1,
            code: child.text,
          });
          break;
        }

        if (EXIT_STATEMENTS.has(child.type)) {
          foundExit = true;
        }
      }
    }

    for (const child of node.namedChildren) {
      walk(child);
    }
  }

  walk(tree.rootNode);
  return deadStatements;
}
