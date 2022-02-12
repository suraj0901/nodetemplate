import { AST } from "./parser.js";

export function ast(template) {
  const ast = new AST(template);
  return ast.genrate();
}
