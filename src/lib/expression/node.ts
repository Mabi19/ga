export interface ExpressionNode {
    eval(x: number, y: number): number;
}

export class ConstantNode implements ExpressionNode {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    eval(_x: number, _y: number): number {
        return this.value;
    }
}

export class AddNode implements ExpressionNode {
    private left: ExpressionNode;
    private right: ExpressionNode;

    constructor(left: ExpressionNode, right: ExpressionNode) {
        this.left = left;
        this.right = right;
    }

    eval(x: number, y: number): number {
        return this.left.eval(x, y) + this.right.eval(x, y);
    }
}

export class SubtractNode implements ExpressionNode {
    private left: ExpressionNode;
    private right: ExpressionNode;

    constructor(left: ExpressionNode, right: ExpressionNode) {
        this.left = left;
        this.right = right;
    }

    eval(x: number, y: number): number {
        return this.left.eval(x, y) - this.right.eval(x, y);
    }
}

export class MultiplyNode implements ExpressionNode {
    private left: ExpressionNode;
    private right: ExpressionNode;

    constructor(left: ExpressionNode, right: ExpressionNode) {
        this.left = left;
        this.right = right;
    }

    eval(x: number, y: number): number {
        return this.left.eval(x, y) * this.right.eval(x, y);
    }
}

export class DivideNode implements ExpressionNode {
    private left: ExpressionNode;
    private right: ExpressionNode;

    constructor(left: ExpressionNode, right: ExpressionNode) {
        this.left = left;
        this.right = right;
    }

    eval(x: number, y: number): number {
        return this.left.eval(x, y) / this.right.eval(x, y);
    }
}

export class ExponentiateNode implements ExpressionNode {
    private left: ExpressionNode;
    private right: ExpressionNode;

    constructor(left: ExpressionNode, right: ExpressionNode) {
        this.left = left;
        this.right = right;
    }

    eval(x: number, y: number): number {
        return this.left.eval(x, y) ** this.right.eval(x, y);
    }
}

export class NegateNode implements ExpressionNode {
    private contents: ExpressionNode;

    constructor(contents: ExpressionNode) {
        this.contents = contents;
    }

    eval(x: number, y: number): number {
        return -this.contents.eval(x, y);
    }
}

export class ParenthesesNode implements ExpressionNode {
    private contents: ExpressionNode;

    constructor(contents: ExpressionNode) {
        this.contents = contents;
    }

    eval(x: number, y: number): number {
        return this.contents.eval(x, y);
    }
}

const FUNCTIONS = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    asinh: Math.asinh,
    acosh: Math.acosh,
    atanh: Math.atanh,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,
    ln: Math.log,
    log: Math.log10,
    lb: Math.log2,
    abs: Math.abs,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
} satisfies Record<string, (x: number) => number>;

export class FunctionInvocationNode implements ExpressionNode {
    private functionName: keyof typeof FUNCTIONS;
    private contents: ExpressionNode;

    constructor(functionName: string, contents: ExpressionNode) {
        if (!Object.hasOwn(FUNCTIONS, functionName)) {
            throw new Error(`Unknown function ${functionName}`);
        }

        this.functionName = functionName as keyof typeof FUNCTIONS;
        this.contents = contents;
    }

    eval(x: number, y: number): number {
        const inner = this.contents.eval(x, y);
        return FUNCTIONS[this.functionName](inner);
    }
}

export class VariableNode implements ExpressionNode {
    private variable: "x" | "y";

    constructor(variable: "x" | "y") {
        this.variable = variable;
    }

    eval(x: number, y: number): number {
        if (this.variable == "x") {
            return x;
        } else {
            return y;
        }
    }
}
