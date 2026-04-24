import type { Board } from "../board.js";
import type { ICommand } from "./icommand.js";

export class CommandResetGame implements ICommand {
    private board: Board;
    private idDimX: string;
    private idDimY: string;
    private idCellSize: string;
    private idPlayerName: string;
    private idComputerStrategy: string;

    constructor(
        board: Board,
        idDimX: string,
        idDimY: string,
        idCellSize: string,
        idPlayerName: string,
        idComputerStrategy: string
    ) {
        this.board = board;
        this.idDimX = idDimX;
        this.idDimY = idDimY;
        this.idCellSize = idCellSize;
        this.idPlayerName = idPlayerName;
        this.idComputerStrategy = idComputerStrategy;
    }

    execute(): void {
        this.board.reInit(this.idDimX, this.idDimY, this.idCellSize, this.idPlayerName, this.idComputerStrategy);
    }

    undo(): void {
        // Undo reset would require saving previous game state
        // For now, this is a placeholder
        console.log("Undo reset game");
    }
}
