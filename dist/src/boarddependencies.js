import { LocalStorageHighscoreRepository } from "./localstoragehighscorerepository.js";
import { MathRandomSource } from "./randomsource.js";
import { BrowserTimerRuntime } from "./timer.js";
export function createBoardDependencies(overrides = {}) {
    const defaults = {
        timerRuntime: BrowserTimerRuntime,
        highscoreRepository: new LocalStorageHighscoreRepository(),
        randomSource: MathRandomSource
    };
    return {
        ...defaults,
        ...overrides
    };
}
