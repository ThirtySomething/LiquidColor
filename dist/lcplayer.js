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
    /**
     * Pure flood-fill simulation (no board mutation).
     * Expands `ownedSet` into unoccupied cells matching `color`, treating
     * every cell in `extraBlocked` as occupied even if the live data says
     * otherwise (used for 2-ply lookahead where simulated gains must be
     * blocked for the opponent's response simulation).
     * Returns the number of cells gained and the full updated ownership set.
     */
    static simulateCapture(cells, definitions, ownedSet, extraBlocked, color) {
        const newOwned = new Set(ownedSet);
        let frontier = Array.from(ownedSet);
        let gained = 0;
        while (frontier.length > 0) {
            const next = [];
            for (const cell of frontier) {
                for (const offset of definitions.Offsets) {
                    const ny = cell.m_PosY + offset.DY;
                    const nx = cell.m_PosX + offset.DX;
                    if (ny < 0 || ny >= definitions.DimensionY || nx < 0 || nx >= definitions.DimensionX) {
                        continue;
                    }
                    const neighbor = cells[ny]?.[nx];
                    if (!neighbor || newOwned.has(neighbor) || extraBlocked.has(neighbor)) {
                        continue;
                    }
                    if (!neighbor.m_Occupied && neighbor.m_Color === color) {
                        newOwned.add(neighbor);
                        next.push(neighbor);
                        gained++;
                    }
                }
            }
            frontier = next;
        }
        return { gained, newOwnedSet: newOwned };
    }
    /**
     * 2-ply minimax color selection.
     *
     * For every candidate computer color C:
     *   1st ply – simulate computer capturing with C  → compGain, newCompOwned
     *   2nd ply – find the human's best response color from the resulting board
     *             (human cannot pick C or their own current color)
     *            → bestHumanGain
     *   score   = compGain - bestHumanGain × DENY_WEIGHT
     *             + frontierColorDiversity × DIVERSITY_WEIGHT
     *
     * frontierColorDiversity counts how many distinct colors the computer's
     * new territory borders — a larger palette means more good moves next turn.
     */
    identifyBestColor(cells, definitions, newColorPlayer, opponent) {
        if (!this.m_BaseCell || !opponent.m_BaseCell) {
            return newColorPlayer;
        }
        // Minimax weights.
        const DENY_WEIGHT = 1.2; // human's best-response gain is penalised 1.2×
        const DIVERSITY_WEIGHT = 0.15; // future-options tiebreaker (bounded by color count)
        // Build live ownership sets.
        const compOwned = new Set();
        const humanOwned = new Set();
        cells.forEach((row) => {
            row.forEach((cell) => {
                if (cell.m_Owner === this.m_PlayerName) {
                    compOwned.add(cell);
                }
                else if (cell.m_Owner === opponent.m_PlayerName) {
                    humanOwned.add(cell);
                }
            });
        });
        const compCurrentColor = this.m_BaseCell.m_Color;
        const humanCurrentColor = opponent.m_BaseCell.m_Color; // = newColorPlayer after human's move
        // All colors present on unoccupied cells.
        const allColors = new Set();
        cells.forEach((row) => {
            row.forEach((cell) => {
                if (!cell.m_Occupied) {
                    allColors.add(cell.m_Color);
                }
            });
        });
        let bestColor = compCurrentColor;
        let bestScore = -Infinity;
        for (const compColor of allColors) {
            if (compColor === newColorPlayer) {
                continue; // human just played this — it becomes computer's color, disallowed
            }
            if (compColor === compCurrentColor) {
                continue; // can't re-select own current color
            }
            // --- 1st ply: computer picks compColor ---
            const { gained: compGain, newOwnedSet: compOwned2 } = LCPlayer.simulateCapture(cells, definitions, compOwned, humanOwned, compColor);
            // --- Frontier color diversity: unique unoccupied colors adjacent to new territory ---
            const frontierColors = new Set();
            for (const cell of compOwned2) {
                for (const offset of definitions.Offsets) {
                    const ny = cell.m_PosY + offset.DY;
                    const nx = cell.m_PosX + offset.DX;
                    if (ny < 0 || ny >= definitions.DimensionY || nx < 0 || nx >= definitions.DimensionX) {
                        continue;
                    }
                    const neighbor = cells[ny]?.[nx];
                    if (neighbor && !neighbor.m_Occupied && !compOwned2.has(neighbor) && !humanOwned.has(neighbor)) {
                        frontierColors.add(neighbor.m_Color);
                    }
                }
            }
            // --- 2nd ply: find human's best response from the resulting board ---
            // After computer plays compColor, human cannot pick compColor (it's now
            // the computer's color) or humanCurrentColor (their own).
            let bestHumanGain = 0;
            for (const humanColor of allColors) {
                if (humanColor === compColor) {
                    continue;
                }
                if (humanColor === humanCurrentColor) {
                    continue;
                }
                const { gained: humanGain } = LCPlayer.simulateCapture(cells, definitions, humanOwned, compOwned2, humanColor);
                if (humanGain > bestHumanGain) {
                    bestHumanGain = humanGain;
                }
            }
            // Final score: own gain − human's best-response gain + frontier diversity bonus.
            const score = compGain
                - bestHumanGain * DENY_WEIGHT
                + frontierColors.size * DIVERSITY_WEIGHT;
            if (score > bestScore) {
                bestScore = score;
                bestColor = compColor;
            }
        }
        return bestColor;
    }
}
