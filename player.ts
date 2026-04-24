import { Board } from "./board.js";
import { Cell } from "./cell.js";
import { Definitions } from "./definitions.js";
import { ComputerStrategyFactory } from "./strategies/computerstrategyfactory.js";
import type { ComputerStrategy } from "./strategies/computerstrategytype.js";
import type { ObserverData } from "./observerdata.js";
import { Util } from "./util.js";

export class Player 
{
    m_PlayerName: string;
    m_BaseCell: Cell | null;
    m_Offsets: unknown[];
    m_IDName: string;
    m_IDScore: string;
    m_IDWinner: string;
    m_NotifyUI: (data: ObserverData) => void;

    constructor(playerName: string, idName: string, idScore: string, notifyUI: (data: ObserverData) => void) 
    {
        this.m_PlayerName = playerName;
        this.m_BaseCell = null;
        this.m_Offsets = [];
        this.m_IDName = idName;
        this.m_IDScore = idScore;
        this.m_IDWinner = "";
        this.m_NotifyUI = notifyUI;
    }

    setNotifyUI(notifyUI: (data: ObserverData) => void): void 
    {
        this.m_NotifyUI = notifyUI;
    }

    counterUpdate(cells: Cell[][], definitions: Definitions): void 
    {
        let cellCounter = 0;

        cells.forEach((currentRow) => 
        {
            currentRow.forEach((currentCell) => 
            {
                if (currentCell.m_Occupied && this.m_PlayerName === currentCell.m_Owner) 
                {
                    cellCounter += 1;
                }
            });
        });

        this.m_NotifyUI({ type: 'score', player: this.m_PlayerName, score: cellCounter });
        if (cellCounter >= definitions.Winner) 
        {
            this.m_NotifyUI({ type: 'winner', player: this.m_PlayerName });
        }
    }

    init(board: Board, posX: number, posY: number, idWinner: string): void 
    {
        Util.setText(this.m_IDName, this.m_PlayerName);
        this.m_IDWinner = idWinner;
        const row = board.m_Grid.m_Cells[posY];
        const baseCell = row ? row[posX] : undefined;
        if (!baseCell) 
        {
            return;
        }

        this.m_BaseCell = baseCell;
        this.m_BaseCell.ownerSet(this.m_PlayerName);

        if (board.m_CanvasElement) 
        {
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
        canvasElement: CanvasRenderingContext2D | null
    ): void 
    {
        if (!this.m_BaseCell || !canvasElement) 
        {
            return;
        }

        this.m_BaseCell.m_Color = this.m_BaseCell.cellColorRandomGet(colors);
        this.m_BaseCell.draw(definitions, canvasElement);
        this.cellsMarkOwner(cells, definitions, canvasElement);
    }

    cellsMarkOwner(
        cells: Cell[][],
        definitions: Definitions,
        canvasElement: CanvasRenderingContext2D
    ): void 
    {
        if (!this.m_BaseCell) 
        {
            return;
        }

        let cellsCollect: Cell[] = [];
        let cellsWork = this.m_BaseCell.neighboursGet(cells, definitions);
        do 
        {
            cellsWork.forEach((currentCell) => 
            {
                if (!this.m_BaseCell) 
                {
                    return;
                }

                currentCell.m_Color = this.m_BaseCell.m_Color;
                currentCell.ownerSet(this.m_PlayerName);
                currentCell.draw(definitions, canvasElement);
                const newNeighbours = currentCell.neighboursGet(cells, definitions);
                newNeighbours.forEach((newCell) => 
                {
                    cellsCollect.push(newCell);
                });
            });

            cellsWork = cellsCollect.filter((value, index, self) => self.indexOf(value) === index);
            cellsCollect = [];
        } while (cellsWork.length > 0);

        this.counterUpdate(cells, definitions);
    }

    identifyBestColor(
        cells: Cell[][],
        definitions: Definitions,
        newColorPlayer: string,
        opponent: Player,
        strategy: ComputerStrategy = "minimax"
    ): string 
    {
        if (!this.m_BaseCell || !opponent.m_BaseCell) 
        {
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
        });
    }
}
