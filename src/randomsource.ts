import type { RandomSource } from "./types/randomsource.js";

export type { RandomSource } from "./types/randomsource.js";

export const MathRandomSource: RandomSource = {
    next(): number {
        return Math.random();
    }
};
