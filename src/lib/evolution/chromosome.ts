import * as State from "@/state";

type HeritageEntry =
    | { type: "parent"; parent: Chromosome; usedBits: number[] }
    | { type: "mutate"; flippedBits: number[] };

// Map a value x in [0, 1] to [low, high]
function mapTo(x: number, low: number, high: number) {
    return x * (high - low) + low;
}

/** A specimen of the population. Immutable. */
export class Chromosome {
    private _bits: number;
    private _id: `${number}#${number}`;

    get x() {
        const value = ((this._bits >> 6) & 0b111111) / 0b111111;
        return mapTo(
            value,
            State.targetFunctionDomain.value.xMin,
            State.targetFunctionDomain.value.xMax,
        );
    }

    get y() {
        const value = (this._bits & 0b111111) / 0b111111;
        return mapTo(
            value,
            State.targetFunctionDomain.value.yMin,
            State.targetFunctionDomain.value.yMax,
        );
    }

    get id() {
        return this._id;
    }

    get bits() {
        return this._bits.toString(2).padStart(12, "0");
    }

    get heritage(): HeritageEntry[] {
        // TODO: track this
        return [];
    }

    constructor(generation: number, index: number) {
        this._id = `${generation}#${index}`;
        this._bits = Math.floor(Math.random() * 0x1000);
    }
}
