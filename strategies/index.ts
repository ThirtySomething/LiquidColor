import { chooseGreedyColor } from "./greedyStrategy.js";
import { chooseMinimaxColor } from "./minimaxStrategy.js";
import type { LCComputerStrategy, LCStrategyInput } from "./types.js";

export function chooseComputerColor(
    strategy: LCComputerStrategy,
    input: LCStrategyInput
): string {
    if (strategy === "greedy") {
        return chooseGreedyColor(input);
    }

    return chooseMinimaxColor(input);
}
