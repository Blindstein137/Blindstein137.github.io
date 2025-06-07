// NotDesmos_Exported.js
export class ExpressionParser {
  constructor() {
    this.tokens = [];
    this.index = 0;
  }

  tokenize(input) {
    const tokens = [];
    const patterns = [
      ['NUMBER', /^[0-9]+(?:\.[0-9]+)?/],
      ['IDENT', /^[a-zA-Z_]\w*/],
      ['PLUS', /^\+/],
      ['MINUS', /^-/],
      ['MUL', /^\*/],
      ['DIV', /^\//],     // ✅ FIXED: Escaped properly
      ['POW', /^\^/],
      ['LPAREN', /^\(/],
      ['RPAREN', /^\)/],
      ['COMMA', /^,/],
      ['WS', /^\s+/],
    ];

    while (input.length > 0) {
      let matched = false;
      for (const [type, regex] of patterns) {
        const match = input.match(regex);
        if (match) {
          if (type !== 'WS') tokens.push({ type, value: match[0] });
          input = input.slice(match[0].length);
          matched = true;
          break;
        }
      }
      if (!matched) throw new Error('Unexpected token: ' + input);
    }
    return tokens;
  }

  parse(input) {
    this.tokens = this.tokenize(input);
    this.index = 0;
    return {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: this.parseExpression()
      }]
    };
  }

  current() {
    return this.tokens[this.index];
  }

  next() {
    this.index++;
  }

  parseExpression() {
    return this.parseAddSub();
  }

  parseAddSub() {
    let node = this.parseMulDiv();
    while (['PLUS', 'MINUS'].includes(this.current()?.type)) {
      const op = this.current().value;
      this.next();
      const right = this.parseMulDiv();
      node = { type: 'BinaryExpression', operator: op, left: node, right };
    }
    return node;
  }

  parseMulDiv() {
    let node = this.parsePow();
    while (['MUL', 'DIV'].includes(this.current()?.type)) {
      const op = this.current().value;
      this.next();
      const right = this.parsePow();
      node = { type: 'BinaryExpression', operator: op, left: node, right };
    }
    return node;
  }

  parsePow() {
    let node = this.parseUnary();
    while (this.current()?.type === 'POW') {
      this.next();
      const right = this.parseUnary();  // Right-associative
      node = { type: 'BinaryExpression', operator: '^', left: node, right };
    }
    return node;
  }

  parseUnary() {
    if (this.current()?.type === 'MINUS') {
      this.next();
      const argument = this.parseUnary();
      return { type: 'UnaryExpression', operator: '-', argument };
    }
    return this.parsePostfix();
  }

  parsePostfix() {
    let node = this.parsePrimary();
    while (this.current()?.type === 'LPAREN') {
      this.next();
      const args = [];
      while (this.current() && this.current().type !== 'RPAREN') {
        args.push(this.parseExpression());
        if (this.current()?.type === 'COMMA') this.next();
      }
      if (this.current()?.type !== 'RPAREN') {
        throw new Error("Expected ')' after function arguments");
      }
      this.next();
      node = {
        type: 'FunctionCall',
        destination: node,
        arguments: args
      };
    }
    return node;
  }

  parsePrimary() {
    const token = this.current();
    if (!token) throw new Error("Unexpected end of input.");

    if (token.type === 'NUMBER') {
      this.next();
      return { type: 'Literal', value: parseFloat(token.value) };
    }

    if (token.type === 'IDENT') {
      this.next();
      return { type: 'Identifier', name: token.value };
    }

    if (token.type === 'LPAREN') {
      this.next();
      const expr = this.parseExpression();
      if (this.current()?.type !== 'RPAREN') {
        throw new Error("Expected ')' to close expression");
      }
      this.next();
      return expr;
    }

    throw new Error("Unexpected token: " + token.value);
  }
}
