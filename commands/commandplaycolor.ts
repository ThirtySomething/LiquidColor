import type { Board } from "../board.js";
import type { ICommand } from "./icommand.js";

export class CommandPlayColor implements ICommand {
    private board: Board;
    private color: string;

    constructor(board: Board, color: string) {
        this.board = board;
        this.color = color;
    }

    execute(): void {
        this.board.performMove(this.color);
    }

    undo(): void {
        // Undo functionality would require game state history
        // For now, this is a placeholder
        console.log(`Undo play color: ${this.color}`);
    }
}
