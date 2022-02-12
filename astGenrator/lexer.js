export class Lexer {
  constructor(template) {
    this.pos = 0;
    this.length = template.length - 1;
    this.template = template;
  }
  curr = (num = 0) => {
    if (!num) return this.template[this.pos + num];
    return this.template.substr(this.pos, num);
  };
  EOF = () => this.pos != this.length;
  next = (num = 0) => {
    if (!num) return this.template[this.pos++];
    const str = this.template.substr(this.pos, num);
    this.pos += num;
    return str;
  };
  assert(conditon, token) {
    if (!conditon) console.error(`Unexpected token '${token}' at ${this.pos} `);
  }
}
