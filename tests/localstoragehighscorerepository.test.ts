import { describe, expect, it, vi } from "vitest";

import { LocalStorageHighscoreRepository } from "../localstoragehighscorerepository";

describe("LocalStorageHighscoreRepository", () => {
    it("load returns null when payload is missing, malformed or invalid", () => {
        const repo = new LocalStorageHighscoreRepository();
        localStorage.clear();

        expect(repo.load()).toBeNull();

        localStorage.setItem(LocalStorageHighscoreRepository.STORAGE_KEY, "{bad-json}");
        expect(repo.load()).toBeNull();

        localStorage.setItem(
            LocalStorageHighscoreRepository.STORAGE_KEY,
            JSON.stringify({ humanWins: "x", computerWins: 1, draws: 0 })
        );
        expect(repo.load()).toBeNull();
    });

    it("save persists valid snapshots and swallows storage errors", () => {
        const repo = new LocalStorageHighscoreRepository();
        localStorage.clear();

        repo.save({ humanWins: 3, computerWins: 2, draws: 1 });
        const stored = localStorage.getItem(LocalStorageHighscoreRepository.STORAGE_KEY);
        expect(stored).toContain("humanWins");

        const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("quota");
        });

        expect(() => repo.save({ humanWins: 0, computerWins: 0, draws: 0 })).not.toThrow();
        setItemSpy.mockRestore();
    });
});
