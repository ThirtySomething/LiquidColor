import { beforeEach, describe, expect, it } from "vitest";

import {
    Highscore,
    LocalStorageHighscoreRepository,
    type HighscoreRepository,
    type HighscoreSnapshot
} from "../src/highscore";

const STORAGE_KEY = LocalStorageHighscoreRepository.STORAGE_KEY;

const setupDom = (): void => {
    document.body.innerHTML = `
        <div id="highscore_name_human"></div>
        <div id="highscore_name_computer"></div>
        <div id="highscore_human"></div>
        <div id="highscore_computer"></div>
        <div id="highscore_draws"></div>
        <div id="highscore_total"></div>
    `;
};

describe("Highscore", () => {
    beforeEach(() => {
        localStorage.clear();
        setupDom();
    });

    it("records wins and persists to localStorage", () => {
        const highscore = new Highscore();

        highscore.recordWin("human");
        highscore.recordWin("computer");
        highscore.recordWin("draw");

        expect(highscore.createSnapshot()).toEqual({
            humanWins: 1,
            computerWins: 1,
            draws: 1
        });

        const stored = localStorage.getItem(STORAGE_KEY);
        expect(stored).toContain("humanWins");
        expect(stored).toContain("computerWins");
        expect(stored).toContain("draws");
    });

    it("loads valid persisted snapshot and can render score and total", () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ humanWins: 2, computerWins: 3, draws: 4 }));
        const highscore = new Highscore();

        highscore.render("Alice", "CPU");

        expect(document.getElementById("highscore_name_human")?.textContent).toBe("Alice");
        expect(document.getElementById("highscore_name_computer")?.textContent).toBe("CPU");
        expect(document.getElementById("highscore_human")?.textContent).toBe("2");
        expect(document.getElementById("highscore_computer")?.textContent).toBe("3");
        expect(document.getElementById("highscore_draws")?.textContent).toBe("4");
        expect(document.getElementById("highscore_total")?.textContent).toBe("9");
    });

    it("falls back to zero state when stored payload is invalid", () => {
        localStorage.setItem(STORAGE_KEY, "{not-json}");

        const highscore = new Highscore();

        expect(highscore.createSnapshot()).toEqual({
            humanWins: 0,
            computerWins: 0,
            draws: 0
        });
    });

    it("falls back to zero state when stored numbers are not valid", () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ humanWins: "x", computerWins: 1, draws: 0 }));

        const highscore = new Highscore();

        expect(highscore.createSnapshot()).toEqual({
            humanWins: 0,
            computerWins: 0,
            draws: 0
        });
    });

    it("uses defaults for missing values in stored payload", () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
        const highscore = new Highscore();

        expect(highscore.createSnapshot()).toEqual({
            humanWins: 0,
            computerWins: 0,
            draws: 0
        });
    });

    it("supports custom repository backend via injection", () => {
        class InMemoryRepository implements HighscoreRepository {
            private m_Snapshot: HighscoreSnapshot | null;

            constructor(initial: HighscoreSnapshot | null) {
                this.m_Snapshot = initial;
            }

            load(): HighscoreSnapshot | null {
                return this.m_Snapshot;
            }

            save(snapshot: HighscoreSnapshot): void {
                this.m_Snapshot = { ...snapshot };
            }
        }

        const repository = new InMemoryRepository({ humanWins: 2, computerWins: 1, draws: 3 });
        const highscore = new Highscore(repository);

        highscore.recordWin("computer");

        expect(highscore.createSnapshot()).toEqual({
            humanWins: 2,
            computerWins: 2,
            draws: 3
        });
    });
});
