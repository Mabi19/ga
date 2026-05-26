import { Chromosome } from "@/lib/evolution/chromosome";
import { ConstantNode, type ExpressionNode } from "@/lib/expression/node";
import { parse } from "@/lib/expression/parse";
import { computed, ref, shallowRef, triggerRef, watchEffect } from "vue";

// Specified here, because a hard bound is required for instancing the graph markers.
export const MAX_POPULATION = 32;

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

export const generations = shallowRef([
    Array.from({ length: 32 }).map((_, i) => new Chromosome(0, i + 1)),
]);
export const currentGeneration = ref(0);
export const population = computed(() => {
    return generations.value[currentGeneration.value];
});

export const highlightID = ref<string | null>(null);

export function nextGeneration() {
    // TODO
    generations.value.push([...generations.value[currentGeneration.value]!]);
    triggerRef(generations);
    currentGeneration.value = generations.value.length - 1;
}
