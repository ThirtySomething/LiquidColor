import type { Board, BoardMoveDeltas, BoardStateSnapshot } from "../board.js";
import type { BoardStateDelta } from "../types/boardstatedelta.js";
import type { ICommand } from "./icommand.js";

export class CommandPlayColor implements ICommand {
    private board: Board;
    private color: string;
    private undoDelta: BoardStateDelta | null;
    private redoDelta: BoardStateDelta | null;
    private lastKnownSnapshot: BoardStateSnapshot | null;

    constructor(board: Board, color: string) {
        this.board = board;
        this.color = color;
        this.undoDelta = null;
        this.redoDelta = null;
        this.lastKnownSnapshot = null;
    }

    private applyDeltaInPlace(base: BoardStateSnapshot, delta: BoardStateDelta): void {
        delta.cells.forEach((cellDelta) => {
            const row = base.cells[cellDelta.y];
            if (!row) {
                return;
            }
            const cell = row[cellDelta.x];
            if (!cell) {
                return;
            }

            cell.color = cellDelta.color;
            cell.owner = cellDelta.owner;
            cell.occupied = cellDelta.occupied;
        });

        if (delta.phase) {
            base.phase = delta.phase;
        }
        if (delta.ui) {
            base.ui = {
                winnerText: delta.ui.winnerText,
                winnerVisible: delta.ui.winnerVisible,
                moveInfoText: delta.ui.moveInfoText,
                moveInfoVisible: delta.ui.moveInfoVisible
            };
        }
        if (delta.highscore) {
            base.highscore = {
                humanWins: delta.highscore.humanWins,
                computerWins: delta.highscore.computerWins,
                draws: delta.highscore.draws
            };
        }
    }

    execute(): void {
        if (this.redoDelta) {
            if (!this.lastKnownSnapshot) {
                this.lastKnownSnapshot = this.board.createStateSnapshot();
            }
            this.applyDeltaInPlace(this.lastKnownSnapshot, this.redoDelta);
            this.board.restoreStateSnapshot(this.lastKnownSnapshot);
            return;
        }

        const stateBefore = this.board.createStateSnapshot();
        const deltas: BoardMoveDeltas = this.board.performMoveWithDelta(this.color);

        this.redoDelta = deltas.redoDelta;
        this.undoDelta = deltas.undoDelta;
        this.lastKnownSnapshot = stateBefore;
        this.applyDeltaInPlace(this.lastKnownSnapshot, this.redoDelta);
    }

    undo(): void {
        if (!this.undoDelta) {
            return;
        }

        if (!this.lastKnownSnapshot) {
            this.lastKnownSnapshot = this.board.createStateSnapshot();
        }

        this.applyDeltaInPlace(this.lastKnownSnapshot, this.undoDelta);
        this.board.restoreStateSnapshot(this.lastKnownSnapshot);
    }
}
