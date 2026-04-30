import { CommandInvoker } from "./commands/commandinvoker.js";
import { CommandPlayColor } from "./commands/commandplaycolor.js";
import { Definitions } from "./definitions.js";
import { GamePhase } from "./gamephase.js";
import { Grid } from "./grid.js";
import { Highscore } from "./highscore.js";
import { Player } from "./player.js";
import { Subject } from "./subject.js";
import { Timer } from "./timer.js";
import { UiFacade } from "./uifacade.js";
import { Util } from "./util.js";
export class Board {
    static instance = null;
    m_CanvasElement;
    m_Definitions;
    m_PlayerHuman;
    m_PlayerComputer;
    m_Grid;
    m_IDGameField;
    m_IDButtonField;
    m_IDWinner;
    m_Timer;
    m_ComputerStrategy;
    m_Phase;
    m_Highscore;
    m_UISubject;
    m_CommandInvoker;
    constructor(definitions, playerHuman, playerComputer) {
        this.m_CanvasElement = null;
        this.m_Definitions = definitions;
        this.m_PlayerHuman = playerHuman;
        this.m_PlayerComputer = playerComputer;
        this.m_Grid = new Grid();
        this.m_IDGameField = "";
        this.m_IDButtonField = "";
        this.m_IDWinner = "";
        this.m_Timer = new Timer("gameduration");
        this.m_ComputerStrategy = "minimax";
        this.m_Phase = GamePhase.Setup();
        this.m_Highscore = new Highscore();
        this.m_UISubject = new Subject();
        this.m_CommandInvoker = new CommandInvoker();
    }
    sanitizePlayerName(playerName) {
        const trimmed = playerName.trim();
        return trimmed.length > 0 ? trimmed : "Besucher";
    }
    static initialize(definitions, playerHuman, playerComputer) {
        if (!Board.instance) {
            Board.instance = new Board(definitions, playerHuman, playerComputer);
        }
    }
    static getInstance() {
        if (!Board.instance) {
            throw new Error("Board not initialized");
        }
        return Board.instance;
    }
    getUISubject() {
        return this.m_UISubject;
    }
    getCommandInvoker() {
        return this.m_CommandInvoker;
    }
    createStateSnapshot() {
        const winnerElement = UiFacade.getElement(this.m_IDWinner);
        const moveInfoElement = UiFacade.getElement("moveinfo");
        const cells = this.m_Grid.m_Cells.map((row) => row.map((cell) => ({
            color: cell.m_Color,
            owner: cell.m_Owner,
            occupied: cell.m_Occupied
        })));
        return {
            cells,
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
    restoreStateSnapshot(snapshot) {
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
                    cell.draw(this.m_Definitions, this.m_CanvasElement);
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
        const stats = this.getScoreStats();
        Util.setText(this.m_PlayerHuman.m_IDScore, String(stats.human));
        Util.setText(this.m_PlayerComputer.m_IDScore, String(stats.computer));
        Util.setText(this.m_IDWinner, snapshot.ui.winnerText);
        if (snapshot.ui.winnerVisible) {
            Util.removeClass(this.m_IDWinner, "dspno");
            Util.show(this.m_IDWinner, "block");
        }
        else {
            UiFacade.addClass(this.m_IDWinner, "dspno");
            UiFacade.hide(this.m_IDWinner);
        }
        Util.setText("moveinfo", snapshot.ui.moveInfoText);
        if (snapshot.ui.moveInfoVisible) {
            Util.show("moveinfo", "block");
        }
        else {
            Util.hide("moveinfo");
        }
    }
    init(gameField, buttonField, idWinner) {
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
    reInit(idDimX, idDimY, idCellSize, idPlayerName, idComputerStrategy) {
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
    readComputerStrategy(strategyValue) {
        if (strategyValue === "greedy") {
            return "greedy";
        }
        return "minimax";
    }
    playerInit(idWinner) {
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
    boardInit() {
        const boardWidth = this.m_Definitions.DimensionX * this.m_Definitions.CellSize;
        const boardHeight = this.m_Definitions.DimensionY * this.m_Definitions.CellSize;
        Util.setText("moveinfo", "");
        const canvas = UiFacade.getCanvasElement(this.m_IDGameField);
        Util.setElementSize(canvas, boardWidth, boardHeight);
        if (!this.m_CanvasElement) {
            return;
        }
        this.m_Grid.gridInit(this.m_Definitions, this.m_CanvasElement);
    }
    boardButtonsInit(buttonField) {
        const buttonContainer = UiFacade.getElement(buttonField);
        if (!buttonContainer) {
            return;
        }
        const btnMargin = Util.getCssNumberVar("--button-gap", 10);
        const numberOfButtons = this.m_Definitions.Colors.length;
        const btnWidth = Math.floor((this.m_Definitions.DimensionX * this.m_Definitions.CellSize) / 5);
        const btnHeight = Math.floor((this.m_Definitions.DimensionY * this.m_Definitions.CellSize -
            (numberOfButtons + 1) * btnMargin) /
            numberOfButtons);
        Util.clearChildren(buttonField);
        this.m_Definitions.Colors.forEach((currentColor) => {
            const colorButton = UiFacade.createColorButton(currentColor, btnWidth, btnHeight, () => {
                const command = new CommandPlayColor(this, currentColor);
                this.m_CommandInvoker.execute(command);
            });
            UiFacade.appendChild(buttonContainer, colorButton);
        });
    }
    performMove(newColorPlayer) {
        if (!this.m_Phase.canAcceptMove() || !this.m_PlayerHuman.m_BaseCell || !this.m_PlayerComputer.m_BaseCell) {
            return;
        }
        Util.hide("moveinfo");
        if (newColorPlayer === this.m_PlayerHuman.m_BaseCell.m_Color) {
            Util.setText("moveinfo", "You cannot select the color of yourself.");
            Util.show("moveinfo", "block");
            return;
        }
        if (newColorPlayer === this.m_PlayerComputer.m_BaseCell.m_Color) {
            Util.setText("moveinfo", "You cannot select the color of your opponent.");
            Util.show("moveinfo", "block");
            return;
        }
        this.m_Timer.startCounting();
        this.m_Grid.gridReset();
        this.m_PlayerHuman.move(this.m_Grid.m_Cells, [newColorPlayer], this.m_Definitions, this.m_CanvasElement);
        if (this.evaluateGameState()) {
            return;
        }
        const newColorComputer = this.m_PlayerComputer.identifyBestColor(this.m_Grid.m_Cells, this.m_Definitions, newColorPlayer, this.m_PlayerHuman, this.m_ComputerStrategy);
        this.m_Grid.gridReset();
        this.m_PlayerComputer.move(this.m_Grid.m_Cells, [newColorComputer], this.m_Definitions, this.m_CanvasElement);
        this.evaluateGameState();
    }
    getScoreStats() {
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
        return {
            human,
            computer,
            occupied,
            total: this.m_Definitions.DimensionX * this.m_Definitions.DimensionY
        };
    }
    endGame(message, winner) {
        this.m_Phase = GamePhase.GameOver();
        this.m_Timer.stop();
        this.m_Highscore.recordWin(winner);
        this.m_Highscore.render(this.m_PlayerHuman.m_PlayerName, this.m_PlayerComputer.m_PlayerName);
        Util.setText(this.m_IDWinner, message);
        Util.removeClass(this.m_IDWinner, "dspno");
        Util.show(this.m_IDWinner, "block");
    }
    evaluateGameState() {
        const stats = this.getScoreStats();
        if (stats.human >= this.m_Definitions.Winner) {
            this.endGame(`Player [${this.m_PlayerHuman.m_PlayerName}] won the game - has more than the half cells occupied.`, "human");
            return true;
        }
        if (stats.computer >= this.m_Definitions.Winner) {
            this.endGame(`Player [${this.m_PlayerComputer.m_PlayerName}] won the game - has more than the half cells occupied.`, "computer");
            return true;
        }
        if (stats.occupied === stats.total) {
            if (stats.human === stats.computer) {
                this.endGame("50:50 draw - both players occupy the same number of cells.", "draw");
            }
            else if (stats.human > stats.computer) {
                this.endGame(`Player [${this.m_PlayerHuman.m_PlayerName}] won the game - more occupied cells at board end.`, "human");
            }
            else {
                this.endGame(`Player [${this.m_PlayerComputer.m_PlayerName}] won the game - more occupied cells at board end.`, "computer");
            }
            return true;
        }
        return false;
    }
}
