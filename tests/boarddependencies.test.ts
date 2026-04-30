import { describe, expect, it, vi } from "vitest";

import { createBoardDependencies } from "../boarddependencies";
import type { HighscoreRepository, HighscoreSnapshot } from "../highscore";
import type { RandomSource } from "../randomsource";
import type { TimerRuntime } from "../timer";

describe("createBoardDependencies", () => {
    it("provides default runtime, storage repository, and randomness", () => {
        const deps = createBoardDependencies();

        expect(deps.timerRuntime).toBeDefined();
        expect(deps.highscoreRepository).toBeDefined();
        expect(deps.randomSource).toBeDefined();
    });

    it("allows overriding individual dependencies", () => {
        const timerRuntime: TimerRuntime = {
            now: () => 123,
            setInterval: vi.fn(() => 1),
            clearInterval: vi.fn()
        };
        const randomSource: RandomSource = { next: () => 0.25 };
        const highscoreRepository: HighscoreRepository = {
            load: (): HighscoreSnapshot | null => ({ humanWins: 1, computerWins: 2, draws: 3 }),
            save: vi.fn()
        };

        const deps = createBoardDependencies({
            timerRuntime,
            randomSource,
            highscoreRepository
        });

        expect(deps.timerRuntime).toBe(timerRuntime);
        expect(deps.randomSource).toBe(randomSource);
        expect(deps.highscoreRepository).toBe(highscoreRepository);
    });
});
