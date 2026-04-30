import type { HighscoreSnapshot } from "./highscoresnapshot.js";
import type { HighscoreWinner } from "./highscorewinner.js";

export interface BoardHighscore {
    recordWin(winner: HighscoreWinner): void;
    render(humanName: string, computerName: string): void;
    createSnapshot(): HighscoreSnapshot;
    restoreSnapshot(snapshot: HighscoreSnapshot): void;
}
