import { LCCell } from "./lccell.js";
import { LCDefinitions } from "./lcdefinitions.js";
import type { LCPlayer } from "./lcplayer.js";

type ColorCountMap = Record<string, number>;

export class LCGrid {
    m_Cells: LCCell[][];

    constructor() {
        this.m_Cells = [];
    }

    gridInit(definitions: LCDefinitions, canvasElement: CanvasRenderingContext2D): void {
        this.m_Cells = [];

        for (let loopY = 0; loopY < definitions.DimensionY; loopY += 1) {
            const row: LCCell[] = [];
            this.m_Cells[loopY] = row;
            for (let loopX = 0; loopX < definitions.DimensionX; loopX += 1) {
                const currentCell = new LCCell(loopX, loopY);
                currentCell.m_Color = currentCell.cellColorRandomGet(definitions.Colors);
                currentCell.draw(definitions, canvasElement);
                row.push(currentCell);
            }
        }
    }

    gridReset(): void {
        this.m_Cells.forEach((currentRow) => {
            currentRow.forEach((currentCell) => {
                currentCell.m_DoRedraw = true;
            });
        });
    }

    getPlayerCells(player: LCPlayer): LCCell[] {
        const playerCells: LCCell[] = [];

        this.m_Cells.forEach((currentRow) => {
            currentRow.forEach((currentCell) => {
                if (currentCell.m_Owner === player.m_PlayerName) {
                    playerCells.push(currentCell);
                }
            });
        });

        return playerCells;
    }

    identifyBorderCells(cells: LCCell[], definitions: LCDefinitions): LCCell[] {
        const borderCells: LCCell[] = [];

        cells.forEach((currentCell) => {
            if (currentCell.isBorderCell(this.m_Cells, definitions)) {
                borderCells.push(currentCell);
            }
        });

        return borderCells;
    }

    playerColorsGet(cells: LCCell[], definitions: LCDefinitions): ColorCountMap {
        const playerColors: ColorCountMap = {};

        cells.forEach((currentCell) => {
            definitions.Offsets.forEach((currentOffset) => {
                const cellPosY = currentCell.m_PosY + currentOffset.DY;

                if (cellPosY < 0 || definitions.DimensionY <= cellPosY) {
                    return;
                }

                const cellPosX = currentCell.m_PosX + currentOffset.DX;
                if (cellPosX < 0 || definitions.DimensionX <= cellPosX) {
                    return;
                }

                const row = this.m_Cells[cellPosY];
                if (!row) {
                    return;
                }

                const currentNeighbour = row[cellPosX];
                if (!currentNeighbour) {
                    return;
                }

                if (currentNeighbour.m_Occupied) {
                    return;
                }

                const valueOld = playerColors[currentNeighbour.m_Color] || 0;
                playerColors[currentNeighbour.m_Color] = valueOld + 1;
            });
        });

        return playerColors;
    }
}
