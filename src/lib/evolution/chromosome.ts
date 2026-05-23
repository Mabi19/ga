type HeritageEntry =
    | { type: "parent"; parent: Chromosome; usedBits: number[] }
    | { type: "mutate"; flippedBits: number[] };

/** A specimen of the population. Immutable. */
export class Chromosome {
    // TODO: replace these two with a bit string
    private _x: number;
    private _y: number;
    private _id: `${number}#${number}`;

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
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
