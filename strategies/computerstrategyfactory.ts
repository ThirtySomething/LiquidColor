import { type RandomSource, MathRandomSource } from "../randomsource.js";
import type { ComputerStrategy } from "./computerstrategytype.js";
import type { IComputerStrategy } from "./icomputerstrategy.js";
import { StrategyGreedy } from "./strategygreedy.js";
import type { StrategyInput } from "./strategyinput.js";
import { StrategyMinimax } from "./strategyminimax.js";

export class ComputerStrategyFactory {
    static create(strategy: ComputerStrategy, randomSource: RandomSource = MathRandomSource): IComputerStrategy {
        if (strategy === "greedy") {
            return new StrategyGreedy(randomSource);
        }

        return new StrategyMinimax(randomSource);
    }

    static chooseComputerColor(
        strategy: ComputerStrategy,
        input: StrategyInput,
        randomSource: RandomSource = MathRandomSource
    ): string {
        return this.create(strategy, randomSource).chooseColor(input);
    }
}
