import { Board } from "./board.js";
import { Cell } from "./cell.js";
import { Definitions } from "./definitions.js";
import type { ObserverData } from "./observerdata.js";
import { type RandomSource, MathRandomSource } from "./randomsource.js";
import { ComputerStrategyFactory } from "./strategies/computerstrategyfactory.js";
import type { ComputerStrategy } from "./strategies/computerstrategytype.js";
import { Util } from "./util.js";

export class Player {
    m_PlayerName: string;
    m_BaseCell: Cell | null;
    m_Offsets: unknown[];
    m_IDName: string;
    m_IDScore: string;
    m_IDWinner: string;
    m_NotifyUI: (data: ObserverData) => void;

    constructor(playerName: string, idName: string, idScore: string, notifyUI: (data: ObserverData) => void) {
        this.m_PlayerName = playerName;
        this.m_BaseCell = null;
        this.m_Offsets = [];
        this.m_IDName = idName;
        this.m_IDScore = idScore;
        this.m_IDWinner = "";
        this.m_NotifyUI = notifyUI;
    }

    setNotifyUI(notifyUI: (data: ObserverData) => void): void {
        this.m_NotifyUI = notifyUI;
    }

    counterUpdate(cells: Cell[][], definitions: Definitions): void {
        let cellCounter = 0;

        cells.forEach((currentRow) => {
            currentRow.forEach((currentCell) => {
                if (currentCell.m_Occupied && this.m_PlayerName === currentCell.m_Owner) {
                    cellCounter += 1;
                }
            });
        });

        this.m_NotifyUI({
            type: 'score',
            player: this.m_PlayerName,
            scoreElementId: this.m_IDScore,
            score: cellCounter
        });
        if (cellCounter >= definitions.Winner) {
            this.m_NotifyUI({ type: 'winner', player: this.m_PlayerName });
        }
    }

    init(board: Board, posX: number, posY: number, idWinner: string): void {
        Util.setText(this.m_IDName, this.m_PlayerName);
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
            this.cellsMarkOwner(
                board.m_Grid.m_Cells,
                board.m_Definitions,
                board.m_CanvasElement
            );
        }
    }

    move(
        cells: Cell[][],
        colors: string[],
        definitions: Definitions,
        canvasElement: CanvasRenderingContext2D | null,
        randomSource: RandomSource = MathRandomSource
    ): void {
        if (!this.m_BaseCell || !canvasElement) {
            return;
        }

        this.m_BaseCell.m_Color = this.m_BaseCell.cellColorRandomGet(colors, randomSource);
        this.m_BaseCell.draw(definitions, canvasElement);
        this.cellsMarkOwner(cells, definitions, canvasElement);
    }

    cellsMarkOwner(
        cells: Cell[][],
        definitions: Definitions,
        canvasElement: CanvasRenderingContext2D
    ): void {
        if (!this.m_BaseCell) {
            return;
        }

        const queue = this.m_BaseCell.neighboursGet(cells, definitions);
        const queued = new Set(queue);

        while (queue.length > 0) {
            const currentCell = queue.shift();
            if (!currentCell) {
                continue;
            }

            queued.delete(currentCell);
            if (!this.m_BaseCell) {
                continue;
            }

            currentCell.m_Color = this.m_BaseCell.m_Color;
            currentCell.ownerSet(this.m_PlayerName);
            currentCell.draw(definitions, canvasElement);

            currentCell.neighboursGet(cells, definitions).forEach((newCell) => {
                if (queued.has(newCell)) {
                    return;
                }

                queued.add(newCell);
                queue.push(newCell);
            });
        }

        this.counterUpdate(cells, definitions);
    }

    identifyBestColor(
        cells: Cell[][],
        definitions: Definitions,
        newColorPlayer: string,
        opponent: Player,
        strategy: ComputerStrategy = "minimax",
        randomSource: RandomSource = MathRandomSource
    ): string {
        if (!this.m_BaseCell || !opponent.m_BaseCell) {
            return newColorPlayer;
        }

        return ComputerStrategyFactory.chooseComputerColor(strategy, {
            cells,
            definitions,
            newColorPlayer,
            compPlayerName: this.m_PlayerName,
            humanPlayerName: opponent.m_PlayerName,
            compCurrentColor: this.m_BaseCell.m_Color,
            humanCurrentColor: opponent.m_BaseCell.m_Color
        }, randomSource);
    }
}
