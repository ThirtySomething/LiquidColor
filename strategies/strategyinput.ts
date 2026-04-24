import type { Cell } from "../cell.js";
import type { Definitions } from "../definitions.js";

export type StrategyInput = {
    cells: Cell[][];
    definitions: Definitions;
    newColorPlayer: string;
    compPlayerName: string;
    humanPlayerName: string;
    compCurrentColor: string;
    humanCurrentColor: string;
};
