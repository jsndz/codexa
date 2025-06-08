import Parser from "tree-sitter";
import Javascript from "tree-sitter-javascript";

const parser = new Parser();
parser.setLanguage(Javascript);

export function analyseJS(code: string) {
  const tree = parser.parse(code);
  console.log(tree.rootNode.toString());
  return tree.rootNode.toString();
}
