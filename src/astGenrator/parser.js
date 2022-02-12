import { Lexer } from "./lexer.js";

export class AST extends Lexer {
  constructor(template) {
    super(template);
  }

  readText(tk, isText = false) {
    let text = "";
    while (this.EOF() && !tk.test(this.curr())) {
      const next = this.curr();
      if (/[\<]/.test(next) && this.curr(4) == "<!--") return text;
      text += this.next();
    }
    if (!isText) this.next();
    return text;
  }

  readExpression = () => {
    let count = 1,
      exp = "";
    while (this.EOF()) {
      let currItem = this.next();
      if (currItem == "{") count++;
      if (currItem == "}") {
        count--;
        if (count == 0) return exp.trim();
      }
      exp += currItem;
    }
  };

  readDynamicExp(parent) {
    this.next();
    const word = this.readText(/[\s\}]/);
    if (word == "if") {
      const token = {
        type: "ifBlock",
        condition: this.readText(/\}/),
        body: [],
      };
      this.go(token);
      parent.body.push(token);
    } else if (word == "each") {
      const token = { type: "eachBlock", body: [] };
      token["array"] = this.readText(/\s/);
      const temp = this.readText(/\s/);
      this.assert(temp == "as", 'expected "as" ');
      const item = this.readText(/\}/);
      token["item"] = item;
      if (item.includes(",")) {
        const [value, id] = item.split(",");
        token["item"] = value;
        token["id"] = id;
      }
      this.go(token);
      parent.body.push(token);
    } else if (word == "for") {
      const token = { type: "forBlock", body: [] };
      let keyword = this.readText(/\s/);
      this.assert(
        keyword == "const" || keyword == "let",
        `expected const or let after for`
      );
      token["item"] = this.readText(/\s/);
      this.assert(this.readText(/\s/) == "of", 'epxcted keyword "of" or "in"');
      token["itrable"] = this.readText(/\}/);
      this.go(token);
      return token;
    } else if (word == "else") {
      if (!/\}/.test(this.template[this.pos - 1])) {
        if (this.curr() == "i") {
          this.next();
          this.assert(this.next() == "f", "expected f");
          const obj = {
            type: "ifBlock",
            condition: this.readText(/\}/),
            body: [],
          };
          this.go(obj);
          parent.else = obj;
          return;
        }
        this.assert(this.curr() == "}", 'expected "}" test');
      }
      parent.else = {
        type: "elseBlock",
        body: [],
      };
      this.go(parent.else);
      return;
    }
  }

  readComment() {
    let comment = this.next(4);
    while (this.EOF()) {
      if (this.curr() == "-") {
        const str = this.curr(3);
        if (str == "-->") {
          comment += this.next(3);
          return comment;
        }
      }
      comment += this.next();
    }
  }

  go(parent) {
    while (this.EOF()) {
      const currItem = this.curr();
      if (currItem == "{") {
        this.next();
        const curr = this.curr();
        if (curr == ":") {
          this.readDynamicExp(parent);
        } else if (curr == "/") {
          this.next();
          const block = this.readText(/\}/) + "Block";
          let conditon = block == parent.type;
          if (parent.type == "elseBlock" && block == "ifBlock") conditon = true;
          this.assert(conditon, " incorrect closing block");
          return;
        } else {
          parent.body.push({
            type: "expression",
            value: this.readExpression(),
          });
        }
      } else if (this.curr(4) == "<!--") {
        parent.body.push({
          type: "comment",
          value: this.readComment(),
        });
      } else {
        parent.body.push({
          type: "string",
          value: this.readText(/\{/, true),
        });
      }
    }
  }

  genrate() {
    const ast = {
      type: "root",
      body: [],
    };
    this.go(ast);
    return ast;
  }
}
