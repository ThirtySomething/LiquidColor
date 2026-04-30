import type { BoardDependencies } from "./board.js";
import { LocalStorageHighscoreRepository } from "./localstoragehighscorerepository.js";
import { MathRandomSource } from "./randomsource.js";
import { BrowserTimerRuntime } from "./timer.js";

export function createBoardDependencies(overrides: BoardDependencies = {}): BoardDependencies {
    const defaults: BoardDependencies = {
        timerRuntime: BrowserTimerRuntime,
        highscoreRepository: new LocalStorageHighscoreRepository(),
        randomSource: MathRandomSource
    };

    return {
        ...defaults,
        ...overrides
    };
}
