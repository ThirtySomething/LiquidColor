import type { ComputerStrategy } from "./computerstrategytype.js";
import type { IComputerStrategy } from "./icomputerstrategy.js";
import { StrategyGreedy } from "./strategygreedy.js";
import type { StrategyInput } from "./strategyinput.js";
import { StrategyMinimax } from "./strategyminimax.js";

export class ComputerStrategyFactory 
{
    static create(strategy: ComputerStrategy): IComputerStrategy 
    {
        if (strategy === "greedy") 
        {
            return new StrategyGreedy();
        }

        return new StrategyMinimax();
    }

    static chooseComputerColor(strategy: ComputerStrategy, input: StrategyInput): string 
    {
        return this.create(strategy).chooseColor(input);
    }
}
