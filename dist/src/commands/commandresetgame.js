export class CommandResetGame {
    board;
    idDimX;
    idDimY;
    idCellSize;
    idPlayerName;
    idComputerStrategy;
    constructor(board, idDimX, idDimY, idCellSize, idPlayerName, idComputerStrategy) {
        this.board = board;
        this.idDimX = idDimX;
        this.idDimY = idDimY;
        this.idCellSize = idCellSize;
        this.idPlayerName = idPlayerName;
        this.idComputerStrategy = idComputerStrategy;
    }
    execute() {
        this.board.reInit(this.idDimX, this.idDimY, this.idCellSize, this.idPlayerName, this.idComputerStrategy);
    }
    undo() {
        // Undo reset would require saving previous game state
        // For now, this is a placeholder
        console.log("Undo reset game");
    }
}
