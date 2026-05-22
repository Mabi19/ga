import {
    AddNode,
    ConstantNode,
    DivideNode,
    ExponentiateNode,
    FunctionInvocationNode,
    MultiplyNode,
    NegateNode,
    ParenthesesNode,
    SubtractNode,
    VariableNode,
    type ExpressionNode,
} from "@/lib/expression/node.ts";

// A math expression parser using recursive descent.

type Token =
    | { type: "+" }
    | { type: "-" }
    | { type: "*" }
    | { type: "/" }
    | { type: "^" } // exponentiation
    | { type: "(" }
    | { type: ")" }
    | { type: "|" } // absolute value
    | { type: "plain"; value: string }
    | { type: "number"; value: number };

type TokenType = Token["type"];

export function tokenize(expr: string): Token[] {
    const numberRegex = /^(?:0|(?:[1-9]\d*))(?:[.,]\d*)?/;

    const result: Token[] = [];
    let plainBuffer = "";

    function flushPlain() {
        if (plainBuffer.length > 0) {
            result.push({ type: "plain", value: plainBuffer });
            plainBuffer = "";
        }
    }

    for (let i = 0; i < expr.length; i++) {
        if (expr[i] == " ") {
            flushPlain();
            continue;
        }
        // literal operators
        switch (expr[i]) {
            case "+":
            case "-":
            case "*":
            case "/":
            case "^":
            case "(":
            case ")":
            case "|":
                flushPlain();
                result.push({ type: expr[i] as "+" });
                continue;
        }

        const numberMatch = expr.slice(i).match(numberRegex);
        if (numberMatch != null) {
            flushPlain();
            result.push({ type: "number", value: parseFloat(numberMatch[0].replace(",", ".")) });
            i += numberMatch[0].length - 1;
            continue;
        }

        // nothing more specific, make it plain
        plainBuffer += expr[i];
    }
    flushPlain();

    return result;
}

class Parser {
    private tokens: Token[];
    private pos: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private peek(): Token | null {
        return this.pos < this.tokens.length ? this.tokens[this.pos]! : null;
    }
    private consume(): Token | null {
        return this.pos < this.tokens.length ? this.tokens[this.pos++]! : null;
    }
    private expect(type: TokenType) {
        const token = this.consume();
        if (token?.type != type) {
            throw new Error(`Expected ${type}`);
        }
        return token;
    }

    // + and -
    private addsub(): ExpressionNode {
        let node = this.muldiv();
        while (true) {
            const token = this.peek();
            if (token?.type == "+") {
                this.consume();
                node = new AddNode(node, this.muldiv());
            } else if (token?.type == "-") {
                this.consume();
                node = new SubtractNode(node, this.muldiv());
            } else {
                break;
            }
        }
        return node;
    }

    // * and /
    private muldiv(): ExpressionNode {
        let node = this.power();
        while (true) {
            const token = this.peek();
            if (token?.type == "*") {
                this.consume();
                node = new MultiplyNode(node, this.power());
            } else if (token?.type == "/") {
                this.consume();
                node = new DivideNode(node, this.power());
            } else {
                break;
            }
        }
        return node;
    }

    // ^
    private power(): ExpressionNode {
        let node = this.unary();
        const token = this.peek();
        if (token?.type == "^") {
            this.consume();
            node = new ExponentiateNode(node, this.power());
        }
        return node;
    }

    // Unary + and -
    private unary(): ExpressionNode {
        const token = this.peek();
        if (token?.type == "+") {
            this.consume();
            // unary + is a no-op
            return this.unary();
        } else if (token?.type == "-") {
            this.consume();
            return new NegateNode(this.unary());
        }
        return this.leaf();
    }

    // Arithmetic leaf: a number, parentheses, or function invocation
    private leaf(): ExpressionNode {
        const token = this.consume();
        if (!token) {
            throw new Error("Unexpected end of input");
        }

        switch (token.type) {
            case "number":
                return new ConstantNode(token.value);
            case "plain": {
                // A variable, known constant, or function call
                const next = this.peek();
                if (next?.type == "(") {
                    this.consume();
                    const arg = this.addsub();
                    this.expect(")");
                    return new FunctionInvocationNode(token.value, arg);
                } else if (token.value == "x" || token.value == "y") {
                    return new VariableNode(token.value);
                } else if (token.value == "pi" || token.value == "π") {
                    return new ConstantNode(Math.PI);
                } else if (token.value == "e") {
                    return new ConstantNode(Math.E);
                } else {
                    throw new Error(`Unknown identifier ${token.value}`);
                }
            }
            case "(": {
                const node = this.addsub();
                this.expect(")");
                return new ParenthesesNode(node);
            }
            case "|": {
                const node = this.addsub();
                this.expect("|");
                return new FunctionInvocationNode("abs", node);
            }
            default:
                throw new Error(`Unexpected token ${token.type}`);
        }
    }

    parse(): ExpressionNode {
        const node = this.addsub();
        if (this.pos < this.tokens.length) {
            throw new Error("Unexpected token at end");
        }
        return node;
    }
}

export function parse(expr: string): ExpressionNode | null {
    const tokens = tokenize(expr);

    try {
        const parser = new Parser(tokens);
        return parser.parse();
    } catch {
        return null;
    }
}
