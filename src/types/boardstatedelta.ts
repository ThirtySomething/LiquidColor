import type { BoardStateSnapshot } from "./boardstatesnapshot.js";
import type { CellDelta } from "./celldelta.js";

export type BoardStateDelta = {
    cells: CellDelta[];
    phase?: BoardStateSnapshot["phase"];
    ui?: BoardStateSnapshot["ui"];
    highscore?: BoardStateSnapshot["highscore"];
};
