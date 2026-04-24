import { GreedyStrategy } from "./greedyStrategy.js";
import { MinimaxStrategy } from "./minimaxStrategy.js";
import type { IComputerStrategy, LCComputerStrategy, LCStrategyInput } from "./types.js";

export class ComputerStrategyFactory {
    static create(strategy: LCComputerStrategy): IComputerStrategy {
        if (strategy === "greedy") {
            return new GreedyStrategy();
        }

        return new MinimaxStrategy();
    }

    static chooseComputerColor(strategy: LCComputerStrategy, input: LCStrategyInput): string {
        return this.create(strategy).chooseColor(input);
    }
}
