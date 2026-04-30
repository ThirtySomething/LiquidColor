import type { HighscoreWinner } from "./highscorewinner.js";
import { LocalStorageHighscoreRepository } from "./localstoragehighscorerepository.js";
import { Util } from "./util.js";

export type { HighscoreWinner } from "./highscorewinner.js";
export { LocalStorageHighscoreRepository } from "./localstoragehighscorerepository.js";

type HighscoreData = {
    humanWins: number;
    computerWins: number;
    draws: number;
};

export type HighscoreSnapshot = HighscoreData;

export interface HighscoreRepository {
    load(): HighscoreSnapshot | null;
    save(snapshot: HighscoreSnapshot): void;
}

export class Highscore {
    private m_Data: HighscoreData;
    private m_Repository: HighscoreRepository;

    constructor(repository: HighscoreRepository = new LocalStorageHighscoreRepository()) {
        this.m_Repository = repository;
        this.m_Data = this.load();
    }

    recordWin(winner: HighscoreWinner): void {
        if (winner === "human") {
            this.m_Data.humanWins += 1;
        }
        else if (winner === "computer") {
            this.m_Data.computerWins += 1;
        }
        else {
            this.m_Data.draws += 1;
        }
        this.save();
    }

    render(humanName: string, computerName: string): void {
        const total = this.m_Data.humanWins + this.m_Data.computerWins + this.m_Data.draws;
        Util.setText("highscore_name_human", humanName);
        Util.setText("highscore_name_computer", computerName);
        Util.setText("highscore_human", String(this.m_Data.humanWins));
        Util.setText("highscore_computer", String(this.m_Data.computerWins));
        Util.setText("highscore_draws", String(this.m_Data.draws));
        Util.setText("highscore_total", String(total));
    }

    createSnapshot(): HighscoreSnapshot {
        return {
            humanWins: this.m_Data.humanWins,
            computerWins: this.m_Data.computerWins,
            draws: this.m_Data.draws
        };
    }

    restoreSnapshot(snapshot: HighscoreSnapshot): void {
        this.m_Data = {
            humanWins: snapshot.humanWins,
            computerWins: snapshot.computerWins,
            draws: snapshot.draws
        };
        this.save();
    }

    private load(): HighscoreData {
        const fallback: HighscoreData = { humanWins: 0, computerWins: 0, draws: 0 };
        return this.m_Repository.load() ?? fallback;
    }

    private save(): void {
        this.m_Repository.save(this.m_Data);
    }
}
