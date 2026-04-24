import { LCDefinitions } from "./lcdefinitions.js";
import { LCGrid } from "./lcgrid.js";
import { LCPlayer } from "./lcplayer.js";
import { clearChildren, getCssNumberVar, getInputValue, hide, removeClass, setElementSize, setInputValue, setText, show } from "./util.js";
export class LCBoard {
    m_CanvasElement;
    m_Definitions;
    m_PlayerHuman;
    m_PlayerComputer;
    m_Grid;
    m_IDGameField;
    m_IDButtonField;
    m_IDWinner;
    m_IDDuration;
    m_ComputerStrategy;
    m_GameStartTimestamp;
    m_GameDurationTimer;
    m_GameOver;
    constructor(definitions, playerHuman, playerComputer) {
        this.m_CanvasElement = null;
        this.m_Definitions = definitions;
        this.m_PlayerHuman = playerHuman;
        this.m_PlayerComputer = playerComputer;
        this.m_Grid = new LCGrid();
        this.m_IDGameField = "";
        this.m_IDButtonField = "";
        this.m_IDWinner = "";
        this.m_IDDuration = "gameduration";
        this.m_ComputerStrategy = "minimax";
        this.m_GameStartTimestamp = null;
        this.m_GameDurationTimer = null;
        this.m_GameOver = false;
    }
    formatDuration(ms) {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    updateDurationDisplay() {
        const elapsedMs = this.m_GameStartTimestamp === null
            ? 0
            : Date.now() - this.m_GameStartTimestamp;
        setText(this.m_IDDuration, `Duration: ${this.formatDuration(elapsedMs)}`);
    }
    startDurationTicker() {
        if (this.m_GameDurationTimer !== null) {
            window.clearInterval(this.m_GameDurationTimer);
        }
        this.m_GameDurationTimer = window.setInterval(() => {
            this.updateDurationDisplay();
        }, 1000);
    }
    resetDurationCounter() {
        if (this.m_GameDurationTimer !== null) {
            window.clearInterval(this.m_GameDurationTimer);
            this.m_GameDurationTimer = null;
        }
        this.m_GameStartTimestamp = null;
        this.updateDurationDisplay();
    }
    startDurationCounter() {
        if (this.m_GameStartTimestamp !== null) {
            return;
        }
        this.m_GameStartTimestamp = Date.now();
        this.updateDurationDisplay();
    }
    stopDurationCounter() {
        if (this.m_GameDurationTimer !== null) {
            window.clearInterval(this.m_GameDurationTimer);
            this.m_GameDurationTimer = null;
        }
        this.updateDurationDisplay();
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
            setInputValue("dimx", this.m_Definitions.DimensionX);
            setInputValue("dimy", this.m_Definitions.DimensionY);
            setInputValue("cellsize", this.m_Definitions.CellSize);
            setInputValue("playername", this.m_PlayerHuman.m_PlayerName);
            setInputValue("computerstrategy", this.m_ComputerStrategy);
        }
    }
    reInit(idDimX, idDimY, idCellSize, idPlayerName, idComputerStrategy) {
        const dimX = getInputValue(idDimX);
        const dimY = getInputValue(idDimY);
        const cellSize = getInputValue(idCellSize);
        const playerName = getInputValue(idPlayerName);
        const computerStrategy = getInputValue(idComputerStrategy);
        this.m_Definitions.reInit(dimX, dimY, cellSize);
        this.m_PlayerHuman.m_PlayerName = playerName;
        this.m_ComputerStrategy = this.readComputerStrategy(computerStrategy);
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
        this.resetDurationCounter();
        this.startDurationTicker();
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
        setText("moveinfo", "");
        const canvas = document.getElementById(this.m_IDGameField);
        setElementSize(canvas, boardWidth, boardHeight);
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
        const btnMargin = getCssNumberVar("--button-gap", 10);
        const numberOfButtons = this.m_Definitions.Colors.length;
        const btnWidth = Math.floor((this.m_Definitions.DimensionX * this.m_Definitions.CellSize) / 5);
        const btnHeight = Math.floor((this.m_Definitions.DimensionY * this.m_Definitions.CellSize -
            (numberOfButtons + 1) * btnMargin) /
            numberOfButtons);
        clearChildren(buttonField);
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
        hide("moveinfo");
        if (newColorPlayer === this.m_PlayerHuman.m_BaseCell.m_Color) {
            setText("moveinfo", "You cannot select the color of yourself.");
            show("moveinfo", "block");
            return;
        }
        if (newColorPlayer === this.m_PlayerComputer.m_BaseCell.m_Color) {
            setText("moveinfo", "You cannot select the color of your opponent.");
            show("moveinfo", "block");
            return;
        }
        this.startDurationCounter();
        this.m_Grid.gridReset();
        this.m_PlayerHuman.move(this.m_Grid.m_Cells, [newColorPlayer], this.m_Definitions, this.m_CanvasElement);
        if (this.evaluateGameState()) {
            return;
        }
        // Simulate the full board for every candidate color to pick the best move.
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
    endGame(message) {
        this.m_GameOver = true;
        this.stopDurationCounter();
        setText(this.m_IDWinner, message);
        removeClass(this.m_IDWinner, "dspno");
        show(this.m_IDWinner, "block");
    }
    evaluateGameState() {
        const stats = this.getScoreStats();
        if (stats.human >= this.m_Definitions.Winner) {
            this.endGame(`Player [${this.m_PlayerHuman.m_PlayerName}] won the game - has more than the half cells occupied.`);
            return true;
        }
        if (stats.computer >= this.m_Definitions.Winner) {
            this.endGame(`Player [${this.m_PlayerComputer.m_PlayerName}] won the game - has more than the half cells occupied.`);
            return true;
        }
        if (stats.occupied === stats.total) {
            if (stats.human === stats.computer) {
                this.endGame("50:50 draw - both players occupy the same number of cells.");
            }
            else if (stats.human > stats.computer) {
                this.endGame(`Player [${this.m_PlayerHuman.m_PlayerName}] won the game - more occupied cells at board end.`);
            }
            else {
                this.endGame(`Player [${this.m_PlayerComputer.m_PlayerName}] won the game - more occupied cells at board end.`);
            }
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=lcboard.js.map