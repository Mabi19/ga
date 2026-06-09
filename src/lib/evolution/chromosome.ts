import * as State from "@/state";

// Any ?Bits[] is an array of 12 booleans, same as the amount of bits in a chromosome.
export type HeritageEntry =
    | { type: "parent"; parent: Chromosome; usedBits: boolean[] }
    | { type: "mutate"; flippedBits: boolean[] };

// Map a value x in [0, 1] to [low, high]
function mapTo(x: number, low: number, high: number) {
    return x * (high - low) + low;
}

/** A specimen of the population. Immutable. */
export class Chromosome {
    private _bits: number;
    private _id: `${number}#${number}`;
    private _heritage: HeritageEntry[];

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

    /** Numerical value of the bit string, for use in bitwise operations. */
    get rawBits() {
        return this._bits;
    }

    get heritage(): HeritageEntry[] {
        return this._heritage;
    }

    /**
     * @param bits - If omitted, random bits are generated (initial population).
     * @param heritage - Tracks how this chromosome was created from parents/mutations.
     */
    constructor(generation: number, index: number, bits?: number, heritage?: HeritageEntry[]) {
        this._id = `${generation}#${index}`;
        this._bits = bits ?? Math.floor(Math.random() * 0x1000);
        this._heritage = heritage ?? [];
    }
}
