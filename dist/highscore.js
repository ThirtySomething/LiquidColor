import { Util } from "./util.js";
export class Highscore {
    static STORAGE_KEY = "liquidcolor-highscore-v1";
    m_Data;
    constructor() {
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
    load() {
        const fallback = { humanWins: 0, computerWins: 0, draws: 0 };
        try {
            const raw = window.localStorage.getItem(Highscore.STORAGE_KEY);
            if (!raw) {
                return fallback;
            }
            const parsed = JSON.parse(raw);
            const humanWins = Number(parsed.humanWins ?? 0);
            const computerWins = Number(parsed.computerWins ?? 0);
            const draws = Number(parsed.draws ?? 0);
            if (Number.isNaN(humanWins) || Number.isNaN(computerWins) || Number.isNaN(draws)) {
                return fallback;
            }
            return { humanWins, computerWins, draws };
        }
        catch {
            return fallback;
        }
    }
    save() {
        window.localStorage.setItem(Highscore.STORAGE_KEY, JSON.stringify(this.m_Data));
    }
}
