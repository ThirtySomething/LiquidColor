import type { BoardUiState } from "./boarduistate.js";
import type { CellState } from "./cellstate.js";
import type { GamePhaseName } from "./gamephasename.js";
import type { HighscoreSnapshot } from "./highscoresnapshot.js";

export type BoardStateSnapshot = {
    cells: CellState[][];
    phase: GamePhaseName;
    ui: BoardUiState;
    highscore: HighscoreSnapshot;
};
