import type { Board, BoardStateSnapshot } from "../board.js";
import type { ICommand } from "./icommand.js";

export class CommandPlayColor implements ICommand {
    private board: Board;
    private color: string;
    private stateBefore: BoardStateSnapshot | null;
    private stateAfter: BoardStateSnapshot | null;

    constructor(board: Board, color: string) {
        this.board = board;
        this.color = color;
        this.stateBefore = null;
        this.stateAfter = null;
    }

    execute(): void {
        if (this.stateAfter) {
            this.board.restoreStateSnapshot(this.stateAfter);
            return;
        }

        this.stateBefore = this.board.createStateSnapshot();
        this.board.performMove(this.color);
        this.stateAfter = this.board.createStateSnapshot();
    }

    undo(): void {
        if (!this.stateBefore) {
            return;
        }
        this.board.restoreStateSnapshot(this.stateBefore);
    }
}
