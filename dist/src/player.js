import { Board } from "./board.js";
import { Cell } from "./cell.js";
import { Definitions } from "./definitions.js";
import { MathRandomSource } from "./randomsource.js";
import { ComputerStrategyFactory } from "./strategies/computerstrategyfactory.js";
import { Util } from "./util.js";
export class Player {
    m_PlayerName;
    m_BaseCell;
    m_Offsets;
    m_CellCounter;
    m_HasScoreBaseline;
    m_IDName;
    m_IDScore;
    m_IDWinner;
    m_NotifyUI;
    constructor(playerName, idName, idScore, notifyUI) {
        this.m_PlayerName = playerName;
        this.m_BaseCell = null;
        this.m_Offsets = [];
        this.m_CellCounter = 0;
        this.m_HasScoreBaseline = false;
        this.m_IDName = idName;
        this.m_IDScore = idScore;
        this.m_IDWinner = "";
        this.m_NotifyUI = notifyUI;
    }
    setNotifyUI(notifyUI) {
        this.m_NotifyUI = notifyUI;
    }
    static captureCellState(cell) {
        return {
            color: cell.m_Color,
            owner: cell.m_Owner,
            occupied: cell.m_Occupied
        };
    }
    static trackMutationStart(cell, mutations) {
        const key = `${cell.m_PosY}:${cell.m_PosX}`;
        if (mutations.has(key)) {
            return;
        }
        const state = Player.captureCellState(cell);
        mutations.set(key, {
            y: cell.m_PosY,
            x: cell.m_PosX,
            before: state,
            after: state
        });
    }
    static trackMutationEnd(cell, mutations) {
        const key = `${cell.m_PosY}:${cell.m_PosX}`;
        const mutation = mutations.get(key);
        if (!mutation) {
            return;
        }
        mutation.after = Player.captureCellState(cell);
    }
    computeScoreDelta(mutations) {
        let delta = 0;
        for (const mutation of mutations.values()) {
            const beforeOwned = mutation.before.occupied && mutation.before.owner === this.m_PlayerName;
            const afterOwned = mutation.after.occupied && mutation.after.owner === this.m_PlayerName;
            if (beforeOwned === afterOwned) {
                continue;
            }
            delta += afterOwned ? 1 : -1;
        }
        return delta;
    }
    counterUpdate(cells, definitions, scoreDelta) {
        if (scoreDelta !== undefined && this.m_HasScoreBaseline) {
            this.m_CellCounter = Math.max(0, this.m_CellCounter + scoreDelta);
        }
        else {
            this.m_CellCounter = 0;
            for (const currentRow of cells) {
                for (const currentCell of currentRow) {
                    if (currentCell.m_Occupied && this.m_PlayerName === currentCell.m_Owner) {
                        this.m_CellCounter += 1;
                    }
                }
            }
            this.m_HasScoreBaseline = true;
        }
        this.m_NotifyUI({
            type: "score",
            player: this.m_PlayerName,
            scoreElementId: this.m_IDScore,
            score: this.m_CellCounter
        });
        if (this.m_CellCounter >= definitions.Winner) {
            this.m_NotifyUI({ type: "winner", player: this.m_PlayerName });
        }
    }
    init(board, posX, posY, idWinner) {
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
            this.cellsMarkOwner(board.m_Grid.m_Cells, board.m_Definitions, board.m_CanvasElement);
        }
    }
    move(cells, colors, definitions, canvasElement, randomSource = MathRandomSource) {
        if (!this.m_BaseCell || !canvasElement) {
            return [];
        }
        const mutations = new Map();
        Player.trackMutationStart(this.m_BaseCell, mutations);
        this.m_BaseCell.m_Color = this.m_BaseCell.cellColorRandomGet(colors, randomSource);
        this.m_BaseCell.draw(definitions, canvasElement);
        Player.trackMutationEnd(this.m_BaseCell, mutations);
        this.cellsMarkOwner(cells, definitions, canvasElement, mutations);
        return Array.from(mutations.values()).filter((mutation) => mutation.before.color !== mutation.after.color ||
            mutation.before.owner !== mutation.after.owner ||
            mutation.before.occupied !== mutation.after.occupied);
    }
    cellsMarkOwner(cells, definitions, canvasElement, mutations) {
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
            if (mutations) {
                Player.trackMutationStart(currentCell, mutations);
            }
            currentCell.m_Color = this.m_BaseCell.m_Color;
            currentCell.ownerSet(this.m_PlayerName);
            currentCell.draw(definitions, canvasElement);
            if (mutations) {
                Player.trackMutationEnd(currentCell, mutations);
            }
            for (const newCell of currentCell.neighboursGet(cells, definitions)) {
                if (queued.has(newCell)) {
                    continue;
                }
                queued.add(newCell);
                queue.push(newCell);
            }
        }
        const scoreDelta = mutations ? this.computeScoreDelta(mutations) : undefined;
        this.counterUpdate(cells, definitions, scoreDelta);
    }
    identifyBestColor(cells, definitions, newColorPlayer, opponent, strategy = "minimax", randomSource = MathRandomSource) {
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
