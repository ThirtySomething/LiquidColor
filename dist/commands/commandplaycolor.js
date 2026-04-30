export class CommandPlayColor {
    board;
    color;
    stateBefore;
    stateAfter;
    constructor(board, color) {
        this.board = board;
        this.color = color;
        this.stateBefore = null;
        this.stateAfter = null;
    }
    execute() {
        if (this.stateAfter) {
            this.board.restoreStateSnapshot(this.stateAfter);
            return;
        }
        this.stateBefore = this.board.createStateSnapshot();
        this.board.performMove(this.color);
        this.stateAfter = this.board.createStateSnapshot();
    }
    undo() {
        if (!this.stateBefore) {
            return;
        }
        this.board.restoreStateSnapshot(this.stateBefore);
    }
}
