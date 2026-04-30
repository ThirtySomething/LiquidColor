import type { Board, BoardStateSnapshot } from "../board.js";
import type { BoardStateDelta } from "../types/boardstatedelta.js";
import type { CellDelta } from "../types/celldelta.js";
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

    private createDelta(from: BoardStateSnapshot, to: BoardStateSnapshot): BoardStateDelta {
        const cells: CellDelta[] = [];

        const rowCount = Math.max(from.cells.length, to.cells.length);
        for (let y = 0; y < rowCount; y += 1) {
            const fromRow = from.cells[y] ?? [];
            const toRow = to.cells[y] ?? [];
            const colCount = Math.max(fromRow.length, toRow.length);

            for (let x = 0; x < colCount; x += 1) {
                const fromCell = fromRow[x];
                const toCell = toRow[x];
                if (!toCell) {
                    continue;
                }

                if (
                    !fromCell ||
                    fromCell.color !== toCell.color ||
                    fromCell.owner !== toCell.owner ||
                    fromCell.occupied !== toCell.occupied
                ) {
                    cells.push({
                        y,
                        x,
                        color: toCell.color,
                        owner: toCell.owner,
                        occupied: toCell.occupied
                    });
                }
            }
        }

        const delta: BoardStateDelta = { cells };
        if (from.phase !== to.phase) {
            delta.phase = to.phase;
        }
        if (
            from.ui.winnerText !== to.ui.winnerText ||
            from.ui.winnerVisible !== to.ui.winnerVisible ||
            from.ui.moveInfoText !== to.ui.moveInfoText ||
            from.ui.moveInfoVisible !== to.ui.moveInfoVisible
        ) {
            delta.ui = {
                winnerText: to.ui.winnerText,
                winnerVisible: to.ui.winnerVisible,
                moveInfoText: to.ui.moveInfoText,
                moveInfoVisible: to.ui.moveInfoVisible
            };
        }
        if (
            from.highscore.humanWins !== to.highscore.humanWins ||
            from.highscore.computerWins !== to.highscore.computerWins ||
            from.highscore.draws !== to.highscore.draws
        ) {
            delta.highscore = {
                humanWins: to.highscore.humanWins,
                computerWins: to.highscore.computerWins,
                draws: to.highscore.draws
            };
        }

        return delta;
    }

    private applyDelta(base: BoardStateSnapshot, delta: BoardStateDelta): BoardStateSnapshot {
        const merged = this.board.cloneStateSnapshot(base);

        delta.cells.forEach((cellDelta) => {
            const row = merged.cells[cellDelta.y];
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
            merged.phase = delta.phase;
        }
        if (delta.ui) {
            merged.ui = {
                winnerText: delta.ui.winnerText,
                winnerVisible: delta.ui.winnerVisible,
                moveInfoText: delta.ui.moveInfoText,
                moveInfoVisible: delta.ui.moveInfoVisible
            };
        }
        if (delta.highscore) {
            merged.highscore = {
                humanWins: delta.highscore.humanWins,
                computerWins: delta.highscore.computerWins,
                draws: delta.highscore.draws
            };
        }

        return merged;
    }

    execute(): void {
        if (this.redoDelta) {
            const current = this.lastKnownSnapshot
                ? this.board.cloneStateSnapshot(this.lastKnownSnapshot)
                : this.board.createStateSnapshot();
            const next = this.applyDelta(current, this.redoDelta);
            this.board.restoreStateSnapshot(next);
            this.lastKnownSnapshot = this.board.cloneStateSnapshot(next);
            return;
        }

        const stateBefore = this.board.createStateSnapshot();
        this.board.performMove(this.color);
        const stateAfter = this.board.createStateSnapshot();

        this.redoDelta = this.createDelta(stateBefore, stateAfter);
        this.undoDelta = this.createDelta(stateAfter, stateBefore);
        this.lastKnownSnapshot = this.board.cloneStateSnapshot(stateAfter);
    }

    undo(): void {
        if (!this.undoDelta) {
            return;
        }

        const current = this.lastKnownSnapshot
            ? this.board.cloneStateSnapshot(this.lastKnownSnapshot)
            : this.board.createStateSnapshot();
        const previous = this.applyDelta(current, this.undoDelta);
        this.board.restoreStateSnapshot(previous);
        this.lastKnownSnapshot = this.board.cloneStateSnapshot(previous);
    }
}
