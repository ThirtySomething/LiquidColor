import type { CellState } from "./cellstate.js";

export type CellMutation = {
    y: number;
    x: number;
    before: CellState;
    after: CellState;
};
