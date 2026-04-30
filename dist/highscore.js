import { LocalStorageHighscoreRepository } from "./localstoragehighscorerepository.js";
import { Util } from "./util.js";
export { LocalStorageHighscoreRepository } from "./localstoragehighscorerepository.js";
export class Highscore {
    m_Data;
    m_Repository;
    constructor(repository = new LocalStorageHighscoreRepository()) {
        this.m_Repository = repository;
        this.m_Data = this.load();
    }
    recordWin(winner) {
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
    render(humanName, computerName) {
        const total = this.m_Data.humanWins + this.m_Data.computerWins + this.m_Data.draws;
        Util.setText("highscore_name_human", humanName);
        Util.setText("highscore_name_computer", computerName);
        Util.setText("highscore_human", String(this.m_Data.humanWins));
        Util.setText("highscore_computer", String(this.m_Data.computerWins));
        Util.setText("highscore_draws", String(this.m_Data.draws));
        Util.setText("highscore_total", String(total));
    }
    createSnapshot() {
        return {
            humanWins: this.m_Data.humanWins,
            computerWins: this.m_Data.computerWins,
            draws: this.m_Data.draws
        };
    }
    restoreSnapshot(snapshot) {
        this.m_Data = {
            humanWins: snapshot.humanWins,
            computerWins: snapshot.computerWins,
            draws: snapshot.draws
        };
        this.save();
    }
    load() {
        const fallback = { humanWins: 0, computerWins: 0, draws: 0 };
        return this.m_Repository.load() ?? fallback;
    }
    save() {
        this.m_Repository.save(this.m_Data);
    }
}
