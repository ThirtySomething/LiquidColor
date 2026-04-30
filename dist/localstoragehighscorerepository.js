export class LocalStorageHighscoreRepository {
    static STORAGE_KEY = "liquidcolor-highscore-v1";
    load() {
        try {
            const raw = window.localStorage.getItem(LocalStorageHighscoreRepository.STORAGE_KEY);
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw);
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
    save(snapshot) {
        try {
            window.localStorage.setItem(LocalStorageHighscoreRepository.STORAGE_KEY, JSON.stringify(snapshot));
        }
        catch {
            // Ignore storage errors to avoid breaking gameplay when storage is unavailable.
        }
    }
}
