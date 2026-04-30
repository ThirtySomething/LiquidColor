import { CommandInvoker } from "./commands/commandinvoker.js";
import { CommandPlayColor } from "./commands/commandplaycolor.js";
import { Definitions } from "./definitions.js";
import { GamePhase, type IGamePhase } from "./gamephase.js";
import { Grid } from "./grid.js";
import { Highscore } from "./highscore.js";
import type { HighscoreWinner } from "./highscorewinner.js";
import { type CellMutation, Player } from "./player.js";
import { MathRandomSource, type RandomSource } from "./randomsource.js";
import type { ComputerStrategy } from "./strategies/computerstrategytype.js";
import { Subject } from "./subject.js";
import { Timer } from "./timer.js";
import type { BoardDependencies } from "./types/boarddependencies.js";
import type { BoardHighscore } from "./types/boardhighscore.js";
import type { BoardStateDelta } from "./types/boardstatedelta.js";
import type { BoardStateSnapshot } from "./types/boardstatesnapshot.js";
import type { BoardTimer } from "./types/boardtimer.js";
import type { CellDelta } from "./types/celldelta.js";
import type { CellState } from "./types/cellstate.js";
import type { ScoreStats } from "./types/scorestats.js";
import { UiFacade } from "./uifacade.js";
import { Util } from "./util.js";

export type { BoardDependencies } from "./types/boarddependencies.js";
export type { BoardHighscore } from "./types/boardhighscore.js";
export type { BoardStateSnapshot } from "./types/boardstatesnapshot.js";
export type { BoardTimer } from "./types/boardtimer.js";

export type BoardMoveDeltas = {
    redoDelta: BoardStateDelta;
    undoDelta: BoardStateDelta;
};

export class Board {
    private static instance: Board | null = null;

    m_CanvasElement: CanvasRenderingContext2D | null;
    m_Definitions: Definitions;
    m_PlayerHuman: Player;
    m_PlayerComputer: Player;
    m_Grid: Grid;
    m_IDGameField: string;
    m_IDButtonField: string;
    m_IDWinner: string;
    m_Timer: BoardTimer;
    m_ComputerStrategy: ComputerStrategy;
    m_Phase: IGamePhase;
    m_Highscore: BoardHighscore;
    m_RandomSource: RandomSource;
    m_UISubject: Subject;
    m_CommandInvoker: CommandInvoker;
    m_ScoreStatsCache: ScoreStats | null;

    private constructor(
        definitions: Definitions,
        playerHuman: Player,
        playerComputer: Player,
        dependencies: BoardDependencies = {}
    ) {
        this.m_CanvasElement = null;
        this.m_Definitions = definitions;
        this.m_PlayerHuman = playerHuman;
        this.m_PlayerComputer = playerComputer;
        this.m_Grid = new Grid();
        this.m_IDGameField = "";
        this.m_IDButtonField = "";
        this.m_IDWinner = "";
        this.m_Timer = dependencies.timer ?? new Timer("gameduration", dependencies.timerRuntime);
        this.m_ComputerStrategy = "minimax";
        this.m_Phase = GamePhase.Setup();
        this.m_Highscore = dependencies.highscore ?? new Highscore(dependencies.highscoreRepository);
        this.m_RandomSource = dependencies.randomSource ?? MathRandomSource;
        this.m_UISubject = new Subject();
        this.m_CommandInvoker = new CommandInvoker();
        this.m_ScoreStatsCache = null;
    }

    private sanitizePlayerName(playerName: string): string {
        const trimmed = playerName.trim();
        return trimmed.length > 0 ? trimmed : "Besucher";
    }

    static initialize(
        definitions: Definitions,
        playerHuman: Player,
        playerComputer: Player,
        dependencies: BoardDependencies = {}
    ): void {
        if (!Board.instance) {
            Board.instance = new Board(definitions, playerHuman, playerComputer, dependencies);
        }
    }

    static getInstance(): Board {
        if (!Board.instance) {
            throw new Error("Board not initialized");
        }
        return Board.instance;
    }

    getUISubject(): Subject {
        return this.m_UISubject;
    }

    getCommandInvoker(): CommandInvoker {
        return this.m_CommandInvoker;
    }

    private mapCellStates<T>(rows: T[][], mapper: (cell: T) => CellState): CellState[][] {
        return rows.map((row) => row.map((cell) => mapper(cell)));
    }

    private cloneCellStates(cells: CellState[][]): CellState[][] {
        return this.mapCellStates(cells, (cell) => ({
            color: cell.color,
            owner: cell.owner,
            occupied: cell.occupied
        }));
    }

    private captureGridCellStates(): CellState[][] {
        return this.mapCellStates(this.m_Grid.m_Cells, (cell) => ({
            color: cell.m_Color,
            owner: cell.m_Owner,
            occupied: cell.m_Occupied
        }));
    }

    cloneStateSnapshot(snapshot: BoardStateSnapshot): BoardStateSnapshot {
        return {
            cells: this.cloneCellStates(snapshot.cells),
            phase: snapshot.phase,
            ui: {
                winnerText: snapshot.ui.winnerText,
                winnerVisible: snapshot.ui.winnerVisible,
                moveInfoText: snapshot.ui.moveInfoText,
                moveInfoVisible: snapshot.ui.moveInfoVisible
            },
            highscore: {
                humanWins: snapshot.highscore.humanWins,
                computerWins: snapshot.highscore.computerWins,
                draws: snapshot.highscore.draws
            }
        };
    }

    private createMetadataSnapshot(): Omit<BoardStateSnapshot, "cells"> {
        const winnerElement = UiFacade.getElement(this.m_IDWinner);
        const moveInfoElement = UiFacade.getElement("moveinfo");

        return {
            phase: this.m_Phase.name,
            ui: {
                winnerText: UiFacade.getText(this.m_IDWinner),
                winnerVisible: winnerElement ? !UiFacade.hasClass(this.m_IDWinner, "dspno") : false,
                moveInfoText: UiFacade.getText("moveinfo"),
                moveInfoVisible: moveInfoElement ? UiFacade.getDisplay("moveinfo") !== "none" : false
            },
            highscore: this.m_Highscore.createSnapshot()
        };
    }

    private static createDeltaFromSnapshotParts(
        metadataFrom: Omit<BoardStateSnapshot, "cells">,
        metadataTo: Omit<BoardStateSnapshot, "cells">,
        cells: CellDelta[]
    ): BoardStateDelta {
        const delta: BoardStateDelta = { cells };

        if (metadataFrom.phase !== metadataTo.phase) {
            delta.phase = metadataTo.phase;
        }
        if (
            metadataFrom.ui.winnerText !== metadataTo.ui.winnerText ||
            metadataFrom.ui.winnerVisible !== metadataTo.ui.winnerVisible ||
            metadataFrom.ui.moveInfoText !== metadataTo.ui.moveInfoText ||
            metadataFrom.ui.moveInfoVisible !== metadataTo.ui.moveInfoVisible
        ) {
            delta.ui = {
                winnerText: metadataTo.ui.winnerText,
                winnerVisible: metadataTo.ui.winnerVisible,
                moveInfoText: metadataTo.ui.moveInfoText,
                moveInfoVisible: metadataTo.ui.moveInfoVisible
            };
        }
        if (
            metadataFrom.highscore.humanWins !== metadataTo.highscore.humanWins ||
            metadataFrom.highscore.computerWins !== metadataTo.highscore.computerWins ||
            metadataFrom.highscore.draws !== metadataTo.highscore.draws
        ) {
            delta.highscore = {
                humanWins: metadataTo.highscore.humanWins,
                computerWins: metadataTo.highscore.computerWins,
                draws: metadataTo.highscore.draws
            };
        }

        return delta;
    }

    private static mergeCellMutations(
        target: Map<string, CellMutation>,
        mutations: CellMutation[] | undefined
    ): void {
        if (!mutations) {
            return;
        }

        mutations.forEach((mutation) => {
            const key = `${mutation.y}:${mutation.x}`;
            const existing = target.get(key);
            if (!existing) {
                target.set(key, {
                    y: mutation.y,
                    x: mutation.x,
                    before: {
                        color: mutation.before.color,
                        owner: mutation.before.owner,
                        occupied: mutation.before.occupied
                    },
                    after: {
                        color: mutation.after.color,
                        owner: mutation.after.owner,
                        occupied: mutation.after.occupied
                    }
                });
                return;
            }

            existing.after = {
                color: mutation.after.color,
                owner: mutation.after.owner,
                occupied: mutation.after.occupied
            };
        });
    }

    private applyMutationsToStats(base: ScoreStats, mutations: CellMutation[] | undefined): ScoreStats {
        if (!mutations) {
            return base;
        }

        const next: ScoreStats = {
            human: base.human,
            computer: base.computer,
            occupied: base.occupied,
            total: base.total
        };

        mutations.forEach((mutation) => {
            if (mutation.before.occupied && !mutation.after.occupied) {
                next.occupied -= 1;
            }
            if (!mutation.before.occupied && mutation.after.occupied) {
                next.occupied += 1;
            }

            if (mutation.before.owner === this.m_PlayerHuman.m_PlayerName) {
                next.human -= 1;
            }
            if (mutation.after.owner === this.m_PlayerHuman.m_PlayerName) {
                next.human += 1;
            }

            if (mutation.before.owner === this.m_PlayerComputer.m_PlayerName) {
                next.computer -= 1;
            }
            if (mutation.after.owner === this.m_PlayerComputer.m_PlayerName) {
                next.computer += 1;
            }
        });

        return next;
    }

    createStateSnapshot(): BoardStateSnapshot {
        const metadata = this.createMetadataSnapshot();

        return {
            cells: this.captureGridCellStates(),
            phase: metadata.phase,
            ui: metadata.ui,
            highscore: metadata.highscore
        };
    }

    restoreStateSnapshot(snapshot: BoardStateSnapshot): void {
        snapshot.cells.forEach((row, y) => {
            const currentRow = this.m_Grid.m_Cells[y];
            if (!currentRow) {
                return;
            }

            row.forEach((cellState, x) => {
                const cell = currentRow[x];
                if (!cell) {
                    return;
                }

                cell.m_Color = cellState.color;
                cell.m_Owner = cellState.owner;
                cell.m_Occupied = cellState.occupied;
                cell.m_DoRedraw = true;
            });
        });

        if (this.m_CanvasElement) {
            this.m_Grid.m_Cells.forEach((row) => {
                row.forEach((cell) => {
                    cell.draw(this.m_Definitions, this.m_CanvasElement as CanvasRenderingContext2D);
                });
            });
        }

        const humanBaseRow = this.m_Grid.m_Cells[this.m_Definitions.DimensionY - 1];
        this.m_PlayerHuman.m_BaseCell = humanBaseRow ? (humanBaseRow[0] ?? null) : null;
        const computerBaseRow = this.m_Grid.m_Cells[0];
        this.m_PlayerComputer.m_BaseCell = computerBaseRow
            ? (computerBaseRow[this.m_Definitions.DimensionX - 1] ?? null)
            : null;

        this.m_Phase = GamePhase.from(snapshot.phase);
        this.m_Highscore.restoreSnapshot(snapshot.highscore);
        this.m_Highscore.render(this.m_PlayerHuman.m_PlayerName, this.m_PlayerComputer.m_PlayerName);

        this.m_ScoreStatsCache = null;
        const stats = this.getScoreStats();
        Util.setText(this.m_PlayerHuman.m_IDScore, String(stats.human));
        Util.setText(this.m_PlayerComputer.m_IDScore, String(stats.computer));

        Util.setText(this.m_IDWinner, snapshot.ui.winnerText);
        if (snapshot.ui.winnerVisible) {
            Util.removeClass(this.m_IDWinner, "dspno");
            Util.show(this.m_IDWinner, "block");
        } else {
            UiFacade.addClass(this.m_IDWinner, "dspno");
            UiFacade.hide(this.m_IDWinner);
        }

        Util.setText("moveinfo", snapshot.ui.moveInfoText);
        if (snapshot.ui.moveInfoVisible) {
            Util.show("moveinfo", "block");
        } else {
            Util.hide("moveinfo");
        }
    }

    init(gameField: string, buttonField: string, idWinner: string): void {
        this.m_IDGameField = gameField;
        this.m_IDButtonField = buttonField;
        this.m_IDWinner = idWinner;
        this.m_CanvasElement = UiFacade.getCanvasContext(this.m_IDGameField);
        if (this.m_CanvasElement) {
            this.boardInit();
            this.boardButtonsInit(this.m_IDButtonField);
            this.playerInit(this.m_IDWinner);
            this.m_Highscore.render(this.m_PlayerHuman.m_PlayerName, this.m_PlayerComputer.m_PlayerName);
            Util.setInputValue("dimx", this.m_Definitions.DimensionX);
            Util.setInputValue("dimy", this.m_Definitions.DimensionY);
            Util.setInputValue("cellsize", this.m_Definitions.CellSize);
            Util.setInputValue("playername", this.m_PlayerHuman.m_PlayerName);
            Util.setInputValue("computerstrategy", this.m_ComputerStrategy);
        }
    }

    reInit(idDimX: string, idDimY: string, idCellSize: string, idPlayerName: string, idComputerStrategy: string): void {
        const dimX = Util.getInputValue(idDimX);
        const dimY = Util.getInputValue(idDimY);
        const cellSize = Util.getInputValue(idCellSize);
        const playerName = Util.getInputValue(idPlayerName);
        const computerStrategy = Util.getInputValue(idComputerStrategy);

        this.m_Definitions.reInit(dimX, dimY, cellSize);
        this.m_PlayerHuman.m_PlayerName = this.sanitizePlayerName(playerName);
        this.m_ComputerStrategy = this.readComputerStrategy(computerStrategy);

        Util.setInputValue(idDimX, this.m_Definitions.DimensionX);
        Util.setInputValue(idDimY, this.m_Definitions.DimensionY);
        Util.setInputValue(idCellSize, this.m_Definitions.CellSize);
        Util.setInputValue(idPlayerName, this.m_PlayerHuman.m_PlayerName);
        Util.setInputValue(idComputerStrategy, this.m_ComputerStrategy);

        this.m_Highscore.render(this.m_PlayerHuman.m_PlayerName, this.m_PlayerComputer.m_PlayerName);

        this.boardInit();
        this.boardButtonsInit(this.m_IDButtonField);
        this.playerInit(this.m_IDWinner);
    }

    readComputerStrategy(strategyValue: string): ComputerStrategy {
        if (strategyValue === "greedy") {
            return "greedy";
        }
        return "minimax";
    }

    playerInit(idWinner: string): void {
        this.m_Phase = GamePhase.InProgress();
        this.m_Timer.reset();
        this.m_Timer.startTicker();
        UiFacade.setText(idWinner, "");
        UiFacade.addClass(idWinner, "dspno");
        UiFacade.setDisplay(idWinner, "");

        this.m_Grid.gridReset();
        this.m_PlayerHuman.init(this, 0, this.m_Definitions.DimensionY - 1, idWinner);

        this.m_Grid.gridReset();
        this.m_PlayerComputer.init(this, this.m_Definitions.DimensionX - 1, 0, idWinner);
    }

    boardInit(): void {
        const boardWidth = this.m_Definitions.DimensionX * this.m_Definitions.CellSize;
        const boardHeight = this.m_Definitions.DimensionY * this.m_Definitions.CellSize;

        Util.setText("moveinfo", "");
        const canvas = UiFacade.getCanvasElement(this.m_IDGameField);
        Util.setElementSize(canvas, boardWidth, boardHeight);

        if (!this.m_CanvasElement) {
            return;
        }
        this.m_Grid.gridInit(this.m_Definitions, this.m_CanvasElement, this.m_RandomSource);
        this.m_ScoreStatsCache = null;
    }

    boardButtonsInit(buttonField: string): void {
        const buttonContainer = UiFacade.getElement(buttonField);
        if (!buttonContainer) {
            return;
        }
        const btnMargin = Util.getCssNumberVar("--button-gap", 10);
        const numberOfButtons = this.m_Definitions.Colors.length;
        const btnWidth = Math.floor((this.m_Definitions.DimensionX * this.m_Definitions.CellSize) / 5);
        const btnHeight = Math.floor(
            (this.m_Definitions.DimensionY * this.m_Definitions.CellSize - (numberOfButtons + 1) * btnMargin) /
            numberOfButtons
        );

        Util.clearChildren(buttonField);
        this.m_Definitions.Colors.forEach((currentColor) => {
            const colorButton = UiFacade.createColorButton(currentColor, btnWidth, btnHeight, () => {
                const command = new CommandPlayColor(this, currentColor);
                this.m_CommandInvoker.execute(command);
            });
            UiFacade.appendChild(buttonContainer, colorButton);
        });
    }

    performMoveWithDelta(newColorPlayer: string): BoardMoveDeltas {
        const metadataBefore = this.createMetadataSnapshot();
        const mutations = new Map<string, CellMutation>();

        if (!this.m_Phase.canAcceptMove() || !this.m_PlayerHuman.m_BaseCell || !this.m_PlayerComputer.m_BaseCell) {
            const metadataAfter = this.createMetadataSnapshot();
            return {
                redoDelta: Board.createDeltaFromSnapshotParts(metadataBefore, metadataAfter, []),
                undoDelta: Board.createDeltaFromSnapshotParts(metadataAfter, metadataBefore, [])
            };
        }

        Util.hide("moveinfo");
        if (newColorPlayer === this.m_PlayerHuman.m_BaseCell.m_Color) {
            Util.setText("moveinfo", "You cannot select the color of yourself.");
            Util.show("moveinfo", "block");
            const metadataAfter = this.createMetadataSnapshot();
            return {
                redoDelta: Board.createDeltaFromSnapshotParts(metadataBefore, metadataAfter, []),
                undoDelta: Board.createDeltaFromSnapshotParts(metadataAfter, metadataBefore, [])
            };
        }
        if (newColorPlayer === this.m_PlayerComputer.m_BaseCell.m_Color) {
            Util.setText("moveinfo", "You cannot select the color of your opponent.");
            Util.show("moveinfo", "block");
            const metadataAfter = this.createMetadataSnapshot();
            return {
                redoDelta: Board.createDeltaFromSnapshotParts(metadataBefore, metadataAfter, []),
                undoDelta: Board.createDeltaFromSnapshotParts(metadataAfter, metadataBefore, [])
            };
        }

        this.m_Timer.startCounting();

        let stats = this.getScoreStats();

        this.m_Grid.gridReset();
        const humanMutations = this.m_PlayerHuman.move(
            this.m_Grid.m_Cells,
            [newColorPlayer],
            this.m_Definitions,
            this.m_CanvasElement,
            this.m_RandomSource
        );
        Board.mergeCellMutations(mutations, humanMutations);
        stats = this.applyMutationsToStats(stats, humanMutations);
        this.m_ScoreStatsCache = stats;

        if (this.evaluateGameState(stats)) {
            const redoCells = Array.from(mutations.values()).map((mutation) => ({
                y: mutation.y,
                x: mutation.x,
                color: mutation.after.color,
                owner: mutation.after.owner,
                occupied: mutation.after.occupied
            }));
            const undoCells = Array.from(mutations.values()).map((mutation) => ({
                y: mutation.y,
                x: mutation.x,
                color: mutation.before.color,
                owner: mutation.before.owner,
                occupied: mutation.before.occupied
            }));
            const metadataAfter = this.createMetadataSnapshot();
            return {
                redoDelta: Board.createDeltaFromSnapshotParts(metadataBefore, metadataAfter, redoCells),
                undoDelta: Board.createDeltaFromSnapshotParts(metadataAfter, metadataBefore, undoCells)
            };
        }

        const newColorComputer = this.m_PlayerComputer.identifyBestColor(
            this.m_Grid.m_Cells,
            this.m_Definitions,
            newColorPlayer,
            this.m_PlayerHuman,
            this.m_ComputerStrategy,
            this.m_RandomSource
        );

        this.m_Grid.gridReset();
        const computerMutations = this.m_PlayerComputer.move(
            this.m_Grid.m_Cells,
            [newColorComputer],
            this.m_Definitions,
            this.m_CanvasElement,
            this.m_RandomSource
        );
        Board.mergeCellMutations(mutations, computerMutations);
        stats = this.applyMutationsToStats(stats, computerMutations);
        this.m_ScoreStatsCache = stats;

        this.evaluateGameState(stats);

        const redoCells = Array.from(mutations.values()).map((mutation) => ({
            y: mutation.y,
            x: mutation.x,
            color: mutation.after.color,
            owner: mutation.after.owner,
            occupied: mutation.after.occupied
        }));
        const undoCells = Array.from(mutations.values()).map((mutation) => ({
            y: mutation.y,
            x: mutation.x,
            color: mutation.before.color,
            owner: mutation.before.owner,
            occupied: mutation.before.occupied
        }));
        const metadataAfter = this.createMetadataSnapshot();

        return {
            redoDelta: Board.createDeltaFromSnapshotParts(metadataBefore, metadataAfter, redoCells),
            undoDelta: Board.createDeltaFromSnapshotParts(metadataAfter, metadataBefore, undoCells)
        };
    }

    performMove(newColorPlayer: string): void {
        this.performMoveWithDelta(newColorPlayer);
    }

    getScoreStats(): ScoreStats {
        if (this.m_ScoreStatsCache) {
            return {
                human: this.m_ScoreStatsCache.human,
                computer: this.m_ScoreStatsCache.computer,
                occupied: this.m_ScoreStatsCache.occupied,
                total: this.m_ScoreStatsCache.total
            };
        }

        let human = 0;
        let computer = 0;
        let occupied = 0;

        this.m_Grid.m_Cells.forEach((row) => {
            row.forEach((cell) => {
                if (cell.m_Occupied) {
                    occupied += 1;
                }
                if (cell.m_Owner === this.m_PlayerHuman.m_PlayerName) {
                    human += 1;
                }
                if (cell.m_Owner === this.m_PlayerComputer.m_PlayerName) {
                    computer += 1;
                }
            });
        });

        const stats: ScoreStats = {
            human,
            computer,
            occupied,
            total: this.m_Definitions.DimensionX * this.m_Definitions.DimensionY
        };

        this.m_ScoreStatsCache = stats;
        return stats;
    }

    endGame(message: string, winner: HighscoreWinner): void {
        this.m_Phase = GamePhase.GameOver();
        this.m_Timer.stop();
        this.m_Highscore.recordWin(winner);
        this.m_Highscore.render(this.m_PlayerHuman.m_PlayerName, this.m_PlayerComputer.m_PlayerName);
        Util.setText(this.m_IDWinner, message);
        Util.removeClass(this.m_IDWinner, "dspno");
        Util.show(this.m_IDWinner, "block");
    }

    evaluateGameState(stats: ScoreStats = this.getScoreStats()): boolean {

        if (stats.human >= this.m_Definitions.Winner) {
            this.endGame(
                `Player [${this.m_PlayerHuman.m_PlayerName}] won the game - has more than the half cells occupied.`,
                "human"
            );
            return true;
        }

        if (stats.computer >= this.m_Definitions.Winner) {
            this.endGame(
                `Player [${this.m_PlayerComputer.m_PlayerName}] won the game - has more than the half cells occupied.`,
                "computer"
            );
            return true;
        }

        if (stats.occupied === stats.total) {
            if (stats.human === stats.computer) {
                this.endGame("50:50 draw - both players occupy the same number of cells.", "draw");
            } else if (stats.human > stats.computer) {
                this.endGame(
                    `Player [${this.m_PlayerHuman.m_PlayerName}] won the game - more occupied cells at board end.`,
                    "human"
                );
            } else {
                this.endGame(
                    `Player [${this.m_PlayerComputer.m_PlayerName}] won the game - more occupied cells at board end.`,
                    "computer"
                );
            }
            return true;
        }

        return false;
    }
}
