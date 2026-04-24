export class CommandPlayColor {
    board;
    color;
    constructor(board, color) {
        this.board = board;
        this.color = color;
    }
    execute() {
        this.board.performMove(this.color);
    }
    undo() {
        // Undo functionality would require game state history
        // For now, this is a placeholder
        console.log(`Undo play color: ${this.color}`);
    }
}
