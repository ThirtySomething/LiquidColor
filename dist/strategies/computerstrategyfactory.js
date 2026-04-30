import { StrategyGreedy } from "./strategygreedy.js";
import { StrategyMinimax } from "./strategyminimax.js";
export class ComputerStrategyFactory {
    static create(strategy) {
        if (strategy === "greedy") {
            return new StrategyGreedy();
        }
        return new StrategyMinimax();
    }
    static chooseComputerColor(strategy, input) {
        return this.create(strategy).chooseColor(input);
    }
}
//# sourceMappingURL=computerstrategyfactory.js.map