import { Chromosome } from "@/lib/evolution/chromosome";
import type { FunctionDomain } from "@/lib/expression/domain";
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

export const targetFunctionDomain = ref<FunctionDomain>({ xMin: -3, xMax: 3, yMin: -3, yMax: 3 });

function generatePopulation(size: number) {
    return Array.from({ length: size }).map((_, i) => new Chromosome(0, i + 1));
}

export const populationSize = ref(4);
export const generations = shallowRef([generatePopulation(populationSize.value)]);
export const currentGeneration = ref(0);
export const population = computed(() => {
    return generations.value[currentGeneration.value]!;
});

export function reset() {
    currentGeneration.value = 0;
    generations.value = [generatePopulation(populationSize.value)];
}

export const highlightID = ref<string | null>(null);

export const pCross = ref(0.8);
export const pMutate = ref(0.2);

export function nextGeneration() {
    // TODO
    generations.value.push([...generations.value[currentGeneration.value]!]);
    triggerRef(generations);
    currentGeneration.value = generations.value.length - 1;
}
