import { LCCell } from "../lccell.js";
import { LCDefinitions } from "../lcdefinitions.js";

export type LCComputerStrategy = "minimax" | "greedy";

export type LCStrategyInput = {
    cells: LCCell[][];
    definitions: LCDefinitions;
    newColorPlayer: string;
    compPlayerName: string;
    humanPlayerName: string;
    compCurrentColor: string;
    humanCurrentColor: string;
};

export interface IComputerStrategy {
    chooseColor(input: LCStrategyInput): string;
}
