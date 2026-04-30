import type { BoardStateDelta } from "./boardstatedelta.js";

export type BoardMoveDeltas = {
    redoDelta: BoardStateDelta;
    undoDelta: BoardStateDelta;
};
