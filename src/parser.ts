import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";

const parser = new Parser();
parser.setLanguage(JavaScript);

export function parseCode(code: string) {
  return parser.parse(code);
}
