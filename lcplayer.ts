type ColorInformation = Record<string, number>;

class LCPlayer {
    m_PlayerName: string;
    m_BaseCell: LCCell | null;
    m_Offsets: unknown[];
    m_IDName: string;
    m_IDScore: string;
    m_IDWinner: string;

    constructor(playerName: string, idName: string, idScore: string) {
        this.m_PlayerName = playerName;
        this.m_BaseCell = null;
        this.m_Offsets = [];
        this.m_IDName = idName;
        this.m_IDScore = idScore;
        this.m_IDWinner = "";
    }

    counterUpdate(cells: LCCell[][], definitions: LCDefinitions): void {
        let cellCounter = 0;

        cells.forEach((currentRow) => {
            currentRow.forEach((currentCell) => {
                if (currentCell.m_Occupied && this.m_PlayerName === currentCell.m_Owner) {
                    cellCounter += 1;
                }
            });
        });

        setText(this.m_IDScore, String(cellCounter));
        if (cellCounter >= definitions.Winner) {
            setText(
                this.m_IDWinner,
                `Player [${this.m_PlayerName}] won the game - has more than the half cells occupied.`
            );
            removeClass(this.m_IDWinner, "dspno");
        }
    }

    init(board: LCBoard, posX: number, posY: number, idWinner: string): void {
        setText(this.m_IDName, this.m_PlayerName);
        this.m_IDWinner = idWinner;
        this.m_BaseCell = board.m_Grid.m_Cells[posY][posX];
        this.m_BaseCell.ownerSet(this.m_PlayerName);

        if (board.m_CanvasElement) {
            this.m_BaseCell.draw(board.m_Definitions, board.m_CanvasElement);
            this.cellsMarkOwner(
                board.m_Grid.m_Cells,
                board.m_Definitions,
                board.m_CanvasElement
            );
        }
    }

    move(
        cells: LCCell[][],
        colors: string[],
        definitions: LCDefinitions,
        canvasElement: CanvasRenderingContext2D | null
    ): void {
        if (!this.m_BaseCell || !canvasElement) {
            return;
        }

        this.m_BaseCell.m_Color = this.m_BaseCell.cellColorRandomGet(colors);
        this.m_BaseCell.draw(definitions, canvasElement);
        this.cellsMarkOwner(cells, definitions, canvasElement);
    }

    cellsMarkOwner(
        cells: LCCell[][],
        definitions: LCDefinitions,
        canvasElement: CanvasRenderingContext2D
    ): void {
        if (!this.m_BaseCell) {
            return;
        }

        let cellsCollect: LCCell[] = [];
        let cellsWork = this.m_BaseCell.neighboursGet(cells, definitions);
        do {
            cellsWork.forEach((currentCell) => {
                if (!this.m_BaseCell) {
                    return;
                }

                currentCell.m_Color = this.m_BaseCell.m_Color;
                currentCell.ownerSet(this.m_PlayerName);
                currentCell.draw(definitions, canvasElement);
                const newNeighbours = currentCell.neighboursGet(cells, definitions);
                newNeighbours.forEach((newCell) => {
                    cellsCollect.push(newCell);
                });
            });

            cellsWork = cellsCollect.filter((value, index, self) => self.indexOf(value) === index);
            cellsCollect = [];
        } while (cellsWork.length > 0);

        this.counterUpdate(cells, definitions);
    }

    identifyBestColor(colorInformation: ColorInformation, newColorPlayer: string): string {
        if (!this.m_BaseCell) {
            return newColorPlayer;
        }

        let bestColor = this.m_BaseCell.m_Color;
        let number = -1;

        Object.keys(colorInformation).forEach((color) => {
            if (color === newColorPlayer) {
                return;
            }
            if (color === this.m_BaseCell?.m_Color) {
                return;
            }
            if (number < colorInformation[color]) {
                number = colorInformation[color];
                bestColor = color;
            }
        });

        return bestColor;
    }
}
