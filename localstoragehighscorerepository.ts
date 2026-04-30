import type { HighscoreRepository, HighscoreSnapshot } from "./highscore.js";

export class LocalStorageHighscoreRepository implements HighscoreRepository {
    static readonly STORAGE_KEY = "liquidcolor-highscore-v1";

    load(): HighscoreSnapshot | null {
        try {
            const raw = window.localStorage.getItem(LocalStorageHighscoreRepository.STORAGE_KEY);
            if (!raw) {
                return null;
            }

            const parsed = JSON.parse(raw) as Partial<HighscoreSnapshot>;
            const humanWins = Number(parsed.humanWins ?? 0);
            const computerWins = Number(parsed.computerWins ?? 0);
            const draws = Number(parsed.draws ?? 0);
            if (Number.isNaN(humanWins) || Number.isNaN(computerWins) || Number.isNaN(draws)) {
                return null;
            }

            return { humanWins, computerWins, draws };
        }
        catch {
            return null;
        }
    }

    save(snapshot: HighscoreSnapshot): void {
        try {
            window.localStorage.setItem(LocalStorageHighscoreRepository.STORAGE_KEY, JSON.stringify(snapshot));
        }
        catch {
            // Ignore storage errors to avoid breaking gameplay when storage is unavailable.
        }
    }
}
