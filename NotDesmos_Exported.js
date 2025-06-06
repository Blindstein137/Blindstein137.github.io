export class ExpressionParser {
  constructor() {
    this.tokens = [];
    this.pos = 0;
  }

  tokenize(input) {
    const tokenSpec = [
      ['LET',      /^let\b/],
      ['NUMBER',   /^\d+(\.\d+)?/],
      ['IDENT',    /^[a-zA-Z_][a-zA-Z0-9_]*/],
      ['EQUALS',   /^=/],
      ['NEQ',      /^!=/],
      ['LEQ',      /^<=/],
      ['GEQ',      /^>=/],
      ['LT',       /^</],
      ['GT',       /^>/],
      ['AND',      /^&&/],
      ['OR',       /^\|\|/],
      ['DOTDOTDOT', /^\.\.\./],
      ['PLUS',     /^\+/],
      ['MINUS',    /^-/],
      ['MULT',     /^\*/],
      ['DIV',      /^\//],
      ['POW',      /^\^/],
      ['LPAREN',   /^\(/],
      ['RPAREN',   /^\)/],
      ['LBRACK',   /^\[/],
      ['RBRACK',   /^\]/],
      ['LBRACE',   /^\{/],
      ['RBRACE',   /^\}/],
      ['COMMA',    /^,/],
      ['COLON',    /^:/],
      ['QUESTION', /^\?/],
      ['D',        /^d\b/],
      ['SEMICOLON', /^;/],
      ['NEWLINE',  /^\n/],
      ['SPACE',    /^\s+/]
    ];
    this.tokens = [];
    this.pos = 0;
    let s = input;
    while (s.length > 0) {
      let matched = false;
      for (let [type, regex] of tokenSpec) {
        const match = regex.exec(s);
        if (match) {
          if (type !== 'SPACE') {
            this.tokens.push({ type, value: match[0] });
          }
          s = s.slice(match[0].length);
          matched = true;
          break;
        }
      }
      if (!matched) throw new Error("Unexpected character: " + s[0]);
    }
  }

  current() { return this.tokens[this.pos]; }
  next() { this.pos++; }

  parse(input) {
    this.tokenize(input);
    if (this.tokens.length === 0) throw new Error("Empty expression");
    return this.parseProgram();
  }

  parseProgram() {
    const body = [];
    while (this.pos < this.tokens.length) {
      const stmt = this.parseStatement();
      body.push(stmt);
      if (this.current() && ['SEMICOLON','NEWLINE'].includes(this.current().type)) this.next();
      else if (this.current()) throw new Error("Expected ';' or newline between statements, got: " + this.current().value);
    }
    return { type: 'Program', body };
  }

  parseStatement() {
    const token = this.current();
    if (token?.type === 'LET') return this.parseAssignment();
    if (token?.type === 'IDENT') {
      const lookahead = this.tokens[this.pos + 1];
      if (lookahead?.type === 'LPAREN') return this.parseFunctionDefinition();
    }
    const expr = this.parseExpression();
    return { type: 'ExpressionStatement', expression: expr };
  }

  parseAssignment() {
    this.next();
    const nameToken = this.current();
    if (!nameToken || nameToken.type !== 'IDENT') throw new Error("Expected variable name after 'let'");
    const name = nameToken.value;
    this.next();
    if (!this.current() || this.current().type !== 'EQUALS') throw new Error("Expected '=' after variable name in assignment");
    this.next();
    const value = this.parseExpression();
    return { type: 'Assignment', name, value };
  }

  parseFunctionDefinition() {
    const name = this.current().value;
    this.next(); this.next();
    const params = [];
    while (this.current() && this.current().type !== 'RPAREN') {
      if (this.current().type !== 'IDENT') throw new Error("Expected parameter name");
      params.push(this.current().value);
      this.next();
      if (this.current()?.type === 'COMMA') this.next();
    }
    if (!this.current() || this.current().type !== 'RPAREN') throw new Error("Expected ')' after parameters");
    this.next();
    if (!this.current() || this.current().type !== 'EQUALS') throw new Error("Expected '=' after function signature");
    this.next();
    const body = this.parseExpression();
    return { type: 'FunctionDefinition', name, params, body };
  }

  parseExpression() { return this.parseComparison(); }

  parseComparison() {
    let node = this.parseLogicalOr();
    while (this.current() && ['LT','GT','LEQ','GEQ','NEQ'].includes(this.current().type)) {
      const opMap = { 'LT': '<','GT': '>','LEQ': '<=','GEQ': '>=','NEQ': '!=' };
      const op = opMap[this.current().type];
      this.next();
      const right = this.parseLogicalOr();
      node = { type: 'ComparisonExpression', operator: op, left: node, right };
    }
    return node;
  }

  parseLogicalOr() {
    let node = this.parseLogicalAnd();
    while (this.current()?.type === 'OR') {
      const op = this.current().value;
      this.next();
      const right = this.parseLogicalAnd();
      node = { type: 'LogicalExpression', operator: op, left: node, right };
    }
    return node;
  }

  parseLogicalAnd() {
    let node = this.parseTernary();
    while (this.current()?.type === 'AND') {
      const op = this.current().value;
      this.next();
      const right = this.parseTernary();
      node = { type: 'LogicalExpression', operator: op, left: node, right };
    }
    return node;
  }

  parseTernary() {
    let condition = this.parseAddSub();
    if (this.current()?.type === 'QUESTION') {
      this.next();
      const trueExpr = this.parseExpression();
      if (!this.current() || this.current().type !== 'COLON') throw new Error("Expected ':' in ternary");
      this.next();
      const falseExpr = this.parseExpression();
      return { type: 'TernaryExpression', condition, trueExpr, falseExpr };
    }
    return condition;
  }

  parseAddSub() {
    let node = this.parseMulDiv();
    while (this.current() && ['PLUS','MINUS'].includes(this.current().type)) {
      const op = this.current().value;
      this.next();
      const right = this.parseMulDiv();
      node = { type: 'BinaryExpression', operator: op, left: node, right };
    }
    return node;
  }

  parseMulDiv() {
    let node = this.parseImplicitMultiplication();
    while (this.current() && ['MULT','DIV'].includes(this.current().type)) {
      const op = this.current().value;
      this.next();
      const right = this.parseImplicitMultiplication();
      node = { type: 'BinaryExpression', operator: op, left: node, right };
    }
    return node;
  }

  parseImplicitMultiplication() {
    let node = this.parsePow();
    while (['NUMBER','IDENT','LPAREN','LBRACK','LBRACE','D'].includes(this.current()?.type)) {
      const right = this.parsePow();
      node = { type: 'BinaryExpression', operator: '*', left: node, right };
    }
    return node;
  }

  parsePow() {
    let node = this.parseUnary();
    while (this.current()?.type === 'POW') {
      this.next();
      const right = this.parseUnary();
      node = { type: 'BinaryExpression', operator: '^', left: node, right };
    }
    return node;
  }

  parseUnary() {
    if (this.current()?.type === 'MINUS') {
      this.next();
      return { type: 'UnaryExpression', operator: '-', argument: this.parseUnary() };
    }
    return this.parsePrimary();
  }

  parsePrimary() {
    const token = this.current();
    if (!token) throw new Error("Unexpected end of input.");

    if (token.type === 'D') {
      this.next();
      if (!this.current() || this.current().type !== 'DIV') throw new Error("Expected '/' after 'd'");
      this.next();
      if (!this.current() || this.current().type !== 'IDENT') throw new Error("Expected variable after 'd/'");
      const variable = this.current().value;
      this.next();
      if (!this.current() || this.current().type !== 'LPAREN') throw new Error("Expected '(' after 'd/var'");
      this.next();
      const expr = this.parseExpression();
      if (!this.current() || this.current().type !== 'RPAREN') throw new Error("Expected ')' to close derivative");
      this.next();
      return { type: 'Derivative', variable, expression: expr };
    }

    if (token.type === 'IDENT' && token.value === 'derivative') {
      this.next();
      if (!this.current() || this.current().type !== 'LPAREN') throw new Error("Expected '(' after 'derivative'");
      this.next();
      const expr = this.parseExpression();
      if (!this.current() || this.current().type !== 'COMMA') throw new Error("Expected ',' after expression in 'derivative'");
      this.next();
      if (!this.current() || this.current().type !== 'IDENT') throw new Error("Expected variable after ',' in 'derivative'");
      const variable = this.current().value;
      this.next();
      if (!this.current() || this.current().type !== 'RPAREN') throw new Error("Expected ')' after variable in 'derivative'");
      this.next();
      return { type: 'Derivative', variable, expression: expr };
    }

    return this._parsePrimaryFallback();
  }

  _parsePrimaryFallback() {
    const token = this.current();
    if (!token) throw new Error("Unexpected end of input.");

    if (token.type === 'NUMBER') {
      this.next();
      if (this.current()?.type === 'DOTDOTDOT') {
        this.next();
        const end = this.parsePrimary();
        return { type: 'Range', start: parseFloat(token.value), end };
      }
      return { type: 'Literal', value: parseFloat(token.value) };
    }

    if (token.type === 'IDENT') {
      const name = token.value;
      this.next();
      if (this.current()?.type === 'LPAREN') {
        this.next();
        const args = [];
        while (this.current() && this.current().type !== 'RPAREN') {
          args.push(this.parseExpression());
          if (this.current()?.type === 'COMMA') this.next();
        }
        if (this.current()?.type !== 'RPAREN') throw new Error("Expected ')' after args");
        this.next();
        return { type: 'FunctionCall', name, arguments: args };
      }
      const mathConstants = { pi: Math.PI, e: Math.E, tau: 2 * Math.PI };
      if (Object.keys(mathConstants).includes(name.toLowerCase())) {
        return { type: 'Literal', value: mathConstants[name.toLowerCase()] };
      }
      return { type: 'Identifier', name };
    }

    if (token.type === 'LPAREN') {
      this.next();
      const expr = this.parseExpression();
      if (this.current()?.type !== 'RPAREN') throw new Error("Expected ')' after group");
      this.next();
      return expr;
    }

    if (token.type === 'LBRACK') {
      this.next();
      const elements = [];
      while (this.current()?.type !== 'RBRACK') {
        elements.push(this.parseExpression());
        if (this.current()?.type === 'COMMA') this.next();
      }
      if (this.current()?.type !== 'RBRACK') throw new Error("Expected ']' for list or vector");
      this.next();
      const kind = elements.every(el => el.type === 'Identifier' || el.type === 'Literal') && (elements.length === 2 || elements.length === 3) ? 'Vector' : 'List';
      return { type: kind, elements };
    }

    if (token.type === 'LBRACE') {
      this.next();
      const branches = [];
      while (this.current() && this.current().type !== 'RBRACE') {
        const condition = this.parseExpression();
        if (this.current()?.type !== 'COLON') throw new Error("Expected ':' in piecewise");
        this.next();
        const value = this.parseExpression();
        branches.push({ condition, value });
        if (this.current()?.type === 'COMMA') this.next();
      }
      if (this.current()?.type !== 'RBRACE') throw new Error("Expected '}' at end of piecewise");
      this.next();
      return { type: 'Piecewise', branches };
    }

    throw new Error("Unexpected token: '" + token.value + "'.");
  }
}
