import { walk } from "../astWalker/index.js";
import { ast } from "../astGenrator/ast.js";

export class Modifier {
  constructor(file, data) {
    this.ast = ast(file);
    this.data = data;
  }
  expressionValue = (expression, obj = {}) => {
    const func = new Function(
      ...Object.keys(this.data),
      ...Object.keys(obj),
      `return ${expression}`
    );
    return func(...Object.values(this.data), ...Object.values(obj));
  };

  modify() {
    const expressionValue = this.expressionValue;
    let output = "";
    walk(this.ast, {
      enter(node, parent, key, index) {
        switch (node.type) {
          case "ifBlock": {
            const block = { type: "iblock" };
            const condition = expressionValue(node.condition);
            if (condition) block.body = node.body;
            else if ("else" in node) block.body = node.else;
            this.replace(block);
            break;
          }
          case "eachBlock": {
            const array = expressionValue(node.array),
              item = node.item.trim(),
              id = node.id;

            for (let i = array.length - 1; i >= 0; i--) {
              const block = {
                type: "eblock",
                body: node.body,
                ctx: {
                  [item]: array[i],
                },
              };
              if (id) block.ctx[id.trim()] = i;
              this.add(block);
            }
            this.remove();
            break;
          }
          case "eblock": {
            this.setCtx(node.ctx);
            break;
          }
          case "expression": {
            output += expressionValue(node.value, this.getCtx());
            break;
          }
          case "string": {
            output += node.value;
            break;
          }
          default:
            break;
        }
      },
    });

    return output;
  }
}
