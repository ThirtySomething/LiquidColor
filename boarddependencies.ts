import { LocalStorageHighscoreRepository } from "./localstoragehighscorerepository.js";
import { MathRandomSource } from "./randomsource.js";
import { BrowserTimerRuntime } from "./timer.js";
import type { BoardDependencies } from "./types/boarddependencies.js";

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
