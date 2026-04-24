import { LCCell } from "./lccell.js";
import { LCDefinitions } from "./lcdefinitions.js";
import { removeClass, setText } from "./util.js";
export class LCPlayer {
    m_PlayerName;
    m_BaseCell;
    m_Offsets;
    m_IDName;
    m_IDScore;
    m_IDWinner;
    constructor(playerName, idName, idScore) {
        this.m_PlayerName = playerName;
        this.m_BaseCell = null;
        this.m_Offsets = [];
        this.m_IDName = idName;
        this.m_IDScore = idScore;
        this.m_IDWinner = "";
    }
    counterUpdate(cells, definitions) {
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
            setText(this.m_IDWinner, `Player [${this.m_PlayerName}] won the game - has more than the half cells occupied.`);
            removeClass(this.m_IDWinner, "dspno");
        }
    }
    init(board, posX, posY, idWinner) {
        setText(this.m_IDName, this.m_PlayerName);
        this.m_IDWinner = idWinner;
        const row = board.m_Grid.m_Cells[posY];
        const baseCell = row ? row[posX] : undefined;
        if (!baseCell) {
            return;
        }
        this.m_BaseCell = baseCell;
        this.m_BaseCell.ownerSet(this.m_PlayerName);
        if (board.m_CanvasElement) {
            this.m_BaseCell.draw(board.m_Definitions, board.m_CanvasElement);
            this.cellsMarkOwner(board.m_Grid.m_Cells, board.m_Definitions, board.m_CanvasElement);
        }
    }
    move(cells, colors, definitions, canvasElement) {
        if (!this.m_BaseCell || !canvasElement) {
            return;
        }
        this.m_BaseCell.m_Color = this.m_BaseCell.cellColorRandomGet(colors);
        this.m_BaseCell.draw(definitions, canvasElement);
        this.cellsMarkOwner(cells, definitions, canvasElement);
    }
    cellsMarkOwner(cells, definitions, canvasElement) {
        if (!this.m_BaseCell) {
            return;
        }
        let cellsCollect = [];
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
    identifyBestColor(colorInformation, newColorPlayer, opponentColorInformation = {}) {
        if (!this.m_BaseCell) {
            return newColorPlayer;
        }
        // Weight applied to denial value: 0 = pure offense, 1 = equal offense/defense.
        const DENY_WEIGHT = 0.5;
        const allColors = new Set([
            ...Object.keys(colorInformation),
            ...Object.keys(opponentColorInformation)
        ]);
        let bestColor = this.m_BaseCell.m_Color;
        let bestScore = -1;
        allColors.forEach((color) => {
            if (color === newColorPlayer) {
                return;
            }
            if (color === this.m_BaseCell?.m_Color) {
                return;
            }
            const ownGain = colorInformation[color] ?? 0;
            const denyGain = opponentColorInformation[color] ?? 0;
            const totalScore = ownGain + denyGain * DENY_WEIGHT;
            if (totalScore > bestScore) {
                bestScore = totalScore;
                bestColor = color;
            }
        });
        return bestColor;
    }
}
