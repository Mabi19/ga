import { Chromosome } from "@/lib/evolution/chromosome";
import { copyOf, crossover, fitness, mutate, rouletteSelect } from "@/lib/evolution/evolution";
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

export const highlightID = ref<string | null>(null);

export function reset() {
    highlightID.value = null;
    currentGeneration.value = 0;
    generations.value = [generatePopulation(populationSize.value)];
}

export const pCross = ref(0.8);
export const pMutate = ref(0.2);

export function nextGeneration() {
    const gen = currentGeneration.value;
    const pop = generations.value[gen]!;
    const func = targetFunction.value;
    const newSize = populationSize.value;
    const newGen = gen + 1;

    // Shift fitnesses to be non-negative — required for roulette wheel selection.
    const rawFitnesses = pop.map((c: Chromosome) => fitness(c, func));
    const minF = Math.min(...rawFitnesses);
    const shift = minF < 0 ? -minF : 0;
    const adjustedFitnesses = rawFitnesses.map((f: number) => f + shift);

    const nextPop: Chromosome[] = [];
    let nextIndex = 1;

    while (nextPop.length < newSize) {
        const parentA = rouletteSelect(pop, adjustedFitnesses);
        const parentB = rouletteSelect(pop, adjustedFitnesses);

        let offA: Chromosome;
        let offB: Chromosome;

        if (Math.random() < pCross.value) {
            const idxA = nextIndex++;
            const idxB = nextIndex++;
            [offA, offB] = crossover(parentA, parentB, newGen, idxA, idxB);
        } else {
            offA = copyOf(parentA, newGen, nextIndex++);
            offB = copyOf(parentB, newGen, nextIndex++);
        }

        offA = mutate(offA, pMutate.value);
        offB = mutate(offB, pMutate.value);

        nextPop.push(offA);
        if (nextPop.length < newSize) nextPop.push(offB);
    }

    generations.value.push(nextPop);
    triggerRef(generations);
    currentGeneration.value = generations.value.length - 1;
}
