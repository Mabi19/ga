import { Chromosome } from "@/lib/evolution/chromosome";
import { ConstantNode, type ExpressionNode } from "@/lib/expression/node";
import { parse } from "@/lib/expression/parse";
import { ref, shallowRef, watchEffect } from "vue";

export const targetFunctionExpression = ref("e^-(x^2 + y^2)");
export const targetFunctionIsValid = ref(true);
export const targetFunction = shallowRef<ExpressionNode>(new ConstantNode(0));
watchEffect(() => {
    const node = parse(targetFunctionExpression.value);
    if (node) {
        targetFunction.value = node;
        targetFunctionIsValid.value = true;
    } else {
        targetFunctionIsValid.value = false;
    }
});

export const population = shallowRef<Chromosome[]>(
    Array.from({ length: 40 }).map((_, i) => new Chromosome(0, i + 1)),
);
