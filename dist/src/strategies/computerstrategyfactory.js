import { MathRandomSource } from "../randomsource.js";
import { StrategyGreedy } from "./strategygreedy.js";
import { StrategyMinimax } from "./strategyminimax.js";
export class ComputerStrategyFactory {
    static create(strategy, randomSource = MathRandomSource) {
        if (strategy === "greedy") {
            return new StrategyGreedy(randomSource);
        }
        return new StrategyMinimax(randomSource);
    }
    static chooseComputerColor(strategy, input, randomSource = MathRandomSource) {
        return this.create(strategy, randomSource).chooseColor(input);
    }
}
