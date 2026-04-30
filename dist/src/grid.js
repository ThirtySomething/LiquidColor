import { Cell } from "./cell.js";
import { Definitions } from "./definitions.js";
import { MathRandomSource } from "./randomsource.js";
export class Grid {
    m_Cells;
    constructor() {
        this.m_Cells = [];
    }
    gridInit(definitions, canvasElement, randomSource = MathRandomSource) {
        this.m_Cells = [];
        for (let loopY = 0; loopY < definitions.DimensionY; loopY += 1) {
            const row = [];
            this.m_Cells[loopY] = row;
            for (let loopX = 0; loopX < definitions.DimensionX; loopX += 1) {
                const currentCell = new Cell(loopX, loopY);
                currentCell.m_Color = currentCell.cellColorRandomGet(definitions.Colors, randomSource);
                currentCell.draw(definitions, canvasElement);
                row.push(currentCell);
            }
        }
    }
    gridReset() {
        for (const currentRow of this.m_Cells) {
            for (const currentCell of currentRow) {
                currentCell.m_DoRedraw = true;
            }
        }
    }
    getPlayerCells(player) {
        const playerCells = [];
        for (const currentRow of this.m_Cells) {
            for (const currentCell of currentRow) {
                if (currentCell.m_Owner === player.m_PlayerName) {
                    playerCells.push(currentCell);
                }
            }
        }
        return playerCells;
    }
    identifyBorderCells(cells, definitions) {
        const borderCells = [];
        for (const currentCell of cells) {
            if (currentCell.isBorderCell(this.m_Cells, definitions)) {
                borderCells.push(currentCell);
            }
        }
        return borderCells;
    }
    playerColorsGet(cells, definitions) {
        const playerColors = {};
        const seenNeighbours = new Set();
        for (const currentCell of cells) {
            for (const currentOffset of definitions.Offsets) {
                const cellPosY = currentCell.m_PosY + currentOffset.DY;
                if (cellPosY < 0 || definitions.DimensionY <= cellPosY) {
                    continue;
                }
                const cellPosX = currentCell.m_PosX + currentOffset.DX;
                if (cellPosX < 0 || definitions.DimensionX <= cellPosX) {
                    continue;
                }
                const row = this.m_Cells[cellPosY];
                if (!row) {
                    continue;
                }
                const currentNeighbour = row[cellPosX];
                if (!currentNeighbour) {
                    continue;
                }
                if (currentNeighbour.m_Occupied) {
                    continue;
                }
                if (seenNeighbours.has(currentNeighbour)) {
                    continue;
                }
                seenNeighbours.add(currentNeighbour);
                const valueOld = playerColors[currentNeighbour.m_Color] || 0;
                playerColors[currentNeighbour.m_Color] = valueOld + 1;
            }
        }
        return playerColors;
    }
}
