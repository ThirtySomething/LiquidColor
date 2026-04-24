import { Definitions } from "./definitions.js";
import { Grid } from "./grid.js";
import { Highscore } from "./highscore.js";
import { Player } from "./player.js";
import { Timer } from "./timer.js";
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
    m_GameOver;
    m_Highscore;
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
        this.m_GameOver = false;
        this.m_Highscore = new Highscore();
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
    init(gameField, buttonField, idWinner) {
        this.m_IDGameField = gameField;
        this.m_IDButtonField = buttonField;
        this.m_IDWinner = idWinner;
        const graphics = document.getElementById(this.m_IDGameField);
        if (graphics?.getContext) {
            this.m_CanvasElement = graphics.getContext("2d");
            if (!this.m_CanvasElement) {
                return;
            }
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
        this.m_PlayerHuman.m_PlayerName = playerName;
        this.m_ComputerStrategy = this.readComputerStrategy(computerStrategy);
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
        this.m_GameOver = false;
        this.m_Timer.reset();
        this.m_Timer.startTicker();
        const winnerElement = document.getElementById(idWinner);
        if (winnerElement) {
            winnerElement.textContent = "";
            winnerElement.classList.add("dspno");
            winnerElement.style.display = "";
        }
        this.m_Grid.gridReset();
        this.m_PlayerHuman.init(this, 0, this.m_Definitions.DimensionY - 1, idWinner);
        this.m_Grid.gridReset();
        this.m_PlayerComputer.init(this, this.m_Definitions.DimensionX - 1, 0, idWinner);
    }
    boardInit() {
        const boardWidth = this.m_Definitions.DimensionX * this.m_Definitions.CellSize;
        const boardHeight = this.m_Definitions.DimensionY * this.m_Definitions.CellSize;
        Util.setText("moveinfo", "");
        const canvas = document.getElementById(this.m_IDGameField);
        Util.setElementSize(canvas, boardWidth, boardHeight);
        if (!this.m_CanvasElement) {
            return;
        }
        this.m_Grid.gridInit(this.m_Definitions, this.m_CanvasElement);
    }
    boardButtonsInit(buttonField) {
        const buttonContainer = document.getElementById(buttonField);
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
            const colorButton = document.createElement("button");
            colorButton.type = "button";
            colorButton.id = currentColor;
            colorButton.className = "gamebtn";
            colorButton.style.backgroundColor = currentColor;
            colorButton.style.width = `${btnWidth}px`;
            colorButton.style.height = `${btnHeight}px`;
            colorButton.setAttribute("aria-label", `Choose ${currentColor} color`);
            colorButton.addEventListener("click", () => {
                this.performMove(currentColor);
            });
            buttonContainer.appendChild(colorButton);
        });
    }
    performMove(newColorPlayer) {
        if (this.m_GameOver || !this.m_PlayerHuman.m_BaseCell || !this.m_PlayerComputer.m_BaseCell) {
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
        this.m_GameOver = true;
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
