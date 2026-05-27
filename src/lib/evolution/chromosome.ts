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
    // TODO: replace these two with a bit string
    private _x: number;
    private _y: number;
    private _id: `${number}#${number}`;

    get x() {
        return mapTo(
            this._x,
            State.targetFunctionDomain.value.xMin,
            State.targetFunctionDomain.value.xMax,
        );
    }

    get y() {
        return mapTo(
            this._y,
            State.targetFunctionDomain.value.yMin,
            State.targetFunctionDomain.value.yMax,
        );
    }

    get id() {
        return this._id;
    }

    get heritage(): HeritageEntry[] {
        // TODO: track this
        return [];
    }

    constructor(generation: number, index: number) {
        this._id = `${generation}#${index}`;
        this._x = Math.random();
        this._y = Math.random();
    }
}
