import type { StrategyInput } from "./strategyinput.js";

export interface IComputerStrategy {
    chooseColor(input: StrategyInput): string;
}
