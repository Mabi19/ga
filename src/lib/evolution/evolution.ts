import type { ExpressionNode } from "@/lib/expression/node";
import { Chromosome } from "./chromosome";

export function fitness(c: Chromosome, func: ExpressionNode): number {
    return func.eval(c.x, c.y);
}

/**
 * Roulette wheel (fitness-proportionate) selection.
 * Fitnesses must be non-negative. Falls back to uniform random if total is zero.
 */
export function rouletteSelect(population: Chromosome[], fitnesses: number[]): Chromosome {
    const total = fitnesses.reduce((sum, f) => sum + f, 0);
    if (total <= 0) {
        return population[Math.floor(Math.random() * population.length)]!;
    }
    let r = Math.random() * total;
    for (let i = 0; i < population.length; i++) {
        r -= fitnesses[i]!;
        if (r <= 0) return population[i]!;
    }
    return population[population.length - 1]!;
}

/**
 * Single-point crossover on the 12-bit string (MSB first).
 * The crossover point is chosen uniformly from positions 1..11.
 * Returns two children with heritage tracking which parent contributed which bits.
 */
export function crossover(
    a: Chromosome,
    b: Chromosome,
    generation: number,
    indexA: number,
    indexB: number,
): [Chromosome, Chromosome] {
    // String position of the crossover point: bits 0..point-1 come from one parent,
    // bits point..11 come from the other.
    const point = Math.floor(Math.random() * 11) + 1;

    // highMask covers string positions 0..point-1, which are the numerically high bits.
    const highMask = (0xfff << (12 - point)) & 0xfff;
    const lowMask = ~highMask & 0xfff;

    const bits1 = (a.rawBits & highMask) | (b.rawBits & lowMask);
    const bits2 = (b.rawBits & highMask) | (a.rawBits & lowMask);

    // usedBits[i] = true means string position i of that parent was used in this child.
    const usedHigh: boolean[] = Array.from({ length: 12 }, (_, i) => i < point);
    const usedLow: boolean[] = Array.from({ length: 12 }, (_, i) => i >= point);

    const child1 = new Chromosome(generation, indexA, bits1, [
        { type: "parent", parent: a, usedBits: usedHigh },
        { type: "parent", parent: b, usedBits: usedLow },
    ]);
    const child2 = new Chromosome(generation, indexB, bits2, [
        { type: "parent", parent: b, usedBits: usedHigh },
        { type: "parent", parent: a, usedBits: usedLow },
    ]);
    return [child1, child2];
}

/**
 * Creates a copy of a chromosome in a new generation, with heritage pointing to the original.
 * Used when crossover does not occur.
 */
export function copyOf(parent: Chromosome, generation: number, index: number): Chromosome {
    return new Chromosome(generation, index, parent.rawBits, [
        { type: "parent", parent, usedBits: Array(12).fill(true) },
    ]);
}

/**
 * Bit-flip mutation: each bit is independently flipped with probability pMutate.
 * Returns the original chromosome unchanged if no bits are flipped.
 * The mutation is appended to the existing heritage.
 */
export function mutate(c: Chromosome, pMutate: number): Chromosome {
    const [genStr, idxStr] = c.id.split("#");
    const gen = parseInt(genStr!);
    const idx = parseInt(idxStr!);

    let newBits = c.rawBits;
    // String index i corresponds to bit (11 - i) in the number.
    const flippedBits = Array.from({ length: 12 }, (_, i) => {
        if (Math.random() < pMutate) {
            newBits ^= 1 << (11 - i);
            return true;
        }
        return false;
    });

    if (!flippedBits.some(Boolean)) return c;

    return new Chromosome(gen, idx, newBits, [
        ...c.heritage,
        { type: "mutate", flippedBits },
    ]);
}
