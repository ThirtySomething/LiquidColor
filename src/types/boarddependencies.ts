import type { BoardHighscore } from "./boardhighscore.js";
import type { BoardTimer } from "./boardtimer.js";
import type { HighscoreRepository } from "./highscorerepository.js";
import type { RandomSource } from "./randomsource.js";
import type { TimerRuntime } from "./timerruntime.js";

export type BoardDependencies = {
    timer?: BoardTimer;
    timerRuntime?: TimerRuntime;
    highscore?: BoardHighscore;
    highscoreRepository?: HighscoreRepository;
    randomSource?: RandomSource;
};
