import { LCDefinitions } from "./lcdefinitions.js";
import { LCGrid } from "./lcgrid.js";
import { LCPlayer } from "./lcplayer.js";
import {
    clearChildren,
    getCssNumberVar,
    getInputValue,
    hide,
    removeClass,
    setElementSize,
    setInputValue,
    setText,
    show
} from "./util.js";

type ScoreStats = {
    human: number;
    computer: number;
    occupied: number;
    total: number;
};

export class LCBoard {
    m_CanvasElement: CanvasRenderingContext2D | null;
    m_Definitions: LCDefinitions;
    m_PlayerHuman: LCPlayer;
    m_PlayerComputer: LCPlayer;
    m_Grid: LCGrid;
    m_IDGameField: string;
    m_IDButtonField: string;
    m_IDWinner: string;
    m_GameOver: boolean;

    constructor(definitions: LCDefinitions, playerHuman: LCPlayer, playerComputer: LCPlayer) {
        this.m_CanvasElement = null;
        this.m_Definitions = definitions;
        this.m_PlayerHuman = playerHuman;
        this.m_PlayerComputer = playerComputer;
        this.m_Grid = new LCGrid();
        this.m_IDGameField = "";
        this.m_IDButtonField = "";
        this.m_IDWinner = "";
        this.m_GameOver = false;
    }

    init(gameField: string, buttonField: string, idWinner: string): void {
        this.m_IDGameField = gameField;
        this.m_IDButtonField = buttonField;
        this.m_IDWinner = idWinner;
        const graphics = document.getElementById(this.m_IDGameField) as HTMLCanvasElement | null;
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
        }
    }

    reInit(idDimX: string, idDimY: string, idCellSize: string, idPlayerName: string): void {
        const dimX = getInputValue(idDimX);
        const dimY = getInputValue(idDimY);
        const cellSize = getInputValue(idCellSize);
        const playerName = getInputValue(idPlayerName);

        this.m_Definitions.reInit(dimX, dimY, cellSize);
        this.m_PlayerHuman.m_PlayerName = playerName;

        this.boardInit();
        this.boardButtonsInit(this.m_IDButtonField);
        this.playerInit(this.m_IDWinner);
    }

    playerInit(idWinner: string): void {
        this.m_GameOver = false;
        const winnerElement = document.getElementById(idWinner);
        if (winnerElement) {
            winnerElement.textContent = "";
            winnerElement.classList.add("dspno");
            winnerElement.style.display = "";
        }

        this.m_Grid.gridReset();
        this.m_PlayerHuman.init(
            this,
            0,
            this.m_Definitions.DimensionY - 1,
            idWinner
        );

        this.m_Grid.gridReset();
        this.m_PlayerComputer.init(
            this,
            this.m_Definitions.DimensionX - 1,
            0,
            idWinner
        );
    }

    boardInit(): void {
        const boardWidth = this.m_Definitions.DimensionX * this.m_Definitions.CellSize;
        const boardHeight = this.m_Definitions.DimensionY * this.m_Definitions.CellSize;

        setText("moveinfo", "");
        const canvas = document.getElementById(this.m_IDGameField) as HTMLCanvasElement | null;
        setElementSize(canvas, boardWidth, boardHeight);

        if (!this.m_CanvasElement) {
            return;
        }
        this.m_Grid.gridInit(this.m_Definitions, this.m_CanvasElement);
    }

    boardButtonsInit(buttonField: string): void {
        const buttonContainer = document.getElementById(buttonField);
        if (!buttonContainer) {
            return;
        }
        const btnMargin = getCssNumberVar("--button-gap", 10);
        const numberOfButtons = this.m_Definitions.Colors.length;
        const btnWidth = Math.floor((this.m_Definitions.DimensionX * this.m_Definitions.CellSize) / 5);
        const btnHeight = Math.floor(
            (this.m_Definitions.DimensionY * this.m_Definitions.CellSize -
                (numberOfButtons + 1) * btnMargin) /
            numberOfButtons
        );

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

    performMove(newColorPlayer: string): void {
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

        this.m_Grid.gridReset();
        this.m_PlayerHuman.move(
            this.m_Grid.m_Cells,
            [newColorPlayer],
            this.m_Definitions,
            this.m_CanvasElement
        );
        if (this.evaluateGameState()) {
            return;
        }

        const computerCells = this.m_Grid.getPlayerCells(this.m_PlayerComputer);
        const borderCells = this.m_Grid.identifyBorderCells(computerCells, this.m_Definitions);
        const colors = this.m_Grid.playerColorsGet(borderCells, this.m_Definitions);

        // Compute human's border colors so the computer can deny high-value colors.
        const humanCells = this.m_Grid.getPlayerCells(this.m_PlayerHuman);
        const humanBorderCells = this.m_Grid.identifyBorderCells(humanCells, this.m_Definitions);
        const humanColors = this.m_Grid.playerColorsGet(humanBorderCells, this.m_Definitions);

        const newColorComputer = this.m_PlayerComputer.identifyBestColor(colors, newColorPlayer, humanColors);

        this.m_Grid.gridReset();
        this.m_PlayerComputer.move(
            this.m_Grid.m_Cells,
            [newColorComputer],
            this.m_Definitions,
            this.m_CanvasElement
        );

        this.evaluateGameState();
    }

    getScoreStats(): ScoreStats {
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

    endGame(message: string): void {
        this.m_GameOver = true;
        setText(this.m_IDWinner, message);
        removeClass(this.m_IDWinner, "dspno");
        show(this.m_IDWinner, "block");
    }

    evaluateGameState(): boolean {
        const stats = this.getScoreStats();

        if (stats.human >= this.m_Definitions.Winner) {
            this.endGame(
                `Player [${this.m_PlayerHuman.m_PlayerName}] won the game - has more than the half cells occupied.`
            );
            return true;
        }

        if (stats.computer >= this.m_Definitions.Winner) {
            this.endGame(
                `Player [${this.m_PlayerComputer.m_PlayerName}] won the game - has more than the half cells occupied.`
            );
            return true;
        }

        if (stats.occupied === stats.total) {
            if (stats.human === stats.computer) {
                this.endGame("50:50 draw - both players occupy the same number of cells.");
            } else if (stats.human > stats.computer) {
                this.endGame(
                    `Player [${this.m_PlayerHuman.m_PlayerName}] won the game - more occupied cells at board end.`
                );
            } else {
                this.endGame(
                    `Player [${this.m_PlayerComputer.m_PlayerName}] won the game - more occupied cells at board end.`
                );
            }
            return true;
        }

        return false;
    }
}
