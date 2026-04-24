import type { LCBoard } from "./lcboard.js";
import { LCCell } from "./lccell.js";
import { LCDefinitions } from "./lcdefinitions.js";
import { removeClass, setText } from "./util.js";

export class LCPlayer {
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

    /**
     * Simulates selecting `candidateColor` and returns the number of
     * unoccupied cells this player would capture across the whole board
     * (full flood-fill, no board mutation).
     */
    simulateCaptureCount(
        cells: LCCell[][],
        definitions: LCDefinitions,
        candidateColor: string
    ): number {
        if (!this.m_BaseCell) {
            return 0;
        }

        const visited = new Set<LCCell>();

        // Seed visited with all currently-owned territory.
        cells.forEach((row) => {
            row.forEach((cell) => {
                if (cell.m_Owner === this.m_PlayerName) {
                    visited.add(cell);
                }
            });
        });

        // BFS: expand from owned territory into unoccupied cells of candidateColor.
        let frontier = Array.from(visited);
        let gained = 0;

        while (frontier.length > 0) {
            const nextFrontier: LCCell[] = [];
            frontier.forEach((cell) => {
                definitions.Offsets.forEach((offset) => {
                    const ny = cell.m_PosY + offset.DY;
                    const nx = cell.m_PosX + offset.DX;
                    if (ny < 0 || ny >= definitions.DimensionY) {
                        return;
                    }
                    if (nx < 0 || nx >= definitions.DimensionX) {
                        return;
                    }
                    const row = cells[ny];
                    if (!row) {
                        return;
                    }
                    const neighbor = row[nx];
                    if (!neighbor || visited.has(neighbor)) {
                        return;
                    }
                    if (!neighbor.m_Occupied && neighbor.m_Color === candidateColor) {
                        visited.add(neighbor);
                        nextFrontier.push(neighbor);
                        gained += 1;
                    }
                });
            });
            frontier = nextFrontier;
        }

        return gained;
    }

    /**
     * Selects the best color for the computer by simulating the full
     * flood-fill for every candidate color on the whole board.
     * Scores = own cells gained + (opponent cells denied × DENY_WEIGHT).
     */
    identifyBestColor(
        cells: LCCell[][],
        definitions: LCDefinitions,
        newColorPlayer: string,
        opponent: LCPlayer
    ): string {
        if (!this.m_BaseCell) {
            return newColorPlayer;
        }

        // 1.5 = value blocking the human 1.5× relative to capturing for self.
        const DENY_WEIGHT = 1.5;

        // Collect every color present on unoccupied cells across the whole board.
        const candidateColors = new Set<string>();
        cells.forEach((row) => {
            row.forEach((cell) => {
                if (!cell.m_Occupied) {
                    candidateColors.add(cell.m_Color);
                }
            });
        });

        let bestColor = this.m_BaseCell.m_Color;
        let bestScore = -1;

        candidateColors.forEach((color) => {
            if (color === newColorPlayer) {
                return;
            }
            if (color === this.m_BaseCell?.m_Color) {
                return;
            }

            const ownGain = this.simulateCaptureCount(cells, definitions, color);
            const denyGain = opponent.simulateCaptureCount(cells, definitions, color);
            const totalScore = ownGain + denyGain * DENY_WEIGHT;

            if (totalScore > bestScore) {
                bestScore = totalScore;
                bestColor = color;
            }
        });

        return bestColor;
    }
}
