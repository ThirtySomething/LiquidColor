"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // lcdefinitions.ts
  var LCDefinitions = class {
    constructor(dimX, dimY, cellSize) {
      __publicField(this, "DimensionX");
      __publicField(this, "DimensionY");
      __publicField(this, "CellSize");
      __publicField(this, "Winner");
      __publicField(this, "Colors");
      __publicField(this, "Offsets");
      this.DimensionX = 0;
      this.DimensionY = 0;
      this.CellSize = 0;
      this.Winner = 0;
      this.Colors = ["blue", "cyan", "green", "red", "yellow"];
      this.Offsets = [
        { DX: 0, DY: 1 },
        { DX: 1, DY: 0 },
        { DX: 0, DY: -1 },
        { DX: -1, DY: 0 }
      ];
      this.reInit(dimX, dimY, cellSize);
    }
    reInit(dimX, dimY, cellSize) {
      this.DimensionX = Number.parseInt(String(dimX), 10);
      this.DimensionY = Number.parseInt(String(dimY), 10);
      this.CellSize = Number.parseInt(String(cellSize), 10);
      this.Winner = Math.floor(this.DimensionX * this.DimensionY / 2 + 1);
    }
  };

  // lccell.ts
  var LCCell = class {
    constructor(posX, posY) {
      __publicField(this, "m_PosX");
      __publicField(this, "m_PosY");
      __publicField(this, "m_Color");
      __publicField(this, "m_Owner");
      __publicField(this, "m_Occupied");
      __publicField(this, "m_DoRedraw");
      this.m_PosX = Number.parseInt(String(posX), 10);
      this.m_PosY = Number.parseInt(String(posY), 10);
      this.m_Color = "white";
      this.m_Owner = "";
      this.m_Occupied = false;
      this.m_DoRedraw = true;
    }
    draw(definitions2, canvasElement) {
      if (this.m_DoRedraw) {
        const cellPosX = definitions2.CellSize * this.m_PosX;
        const cellPosY = definitions2.CellSize * this.m_PosY;
        canvasElement.beginPath();
        canvasElement.rect(
          cellPosX,
          cellPosY,
          definitions2.CellSize,
          definitions2.CellSize
        );
        canvasElement.fillStyle = this.m_Color;
        canvasElement.fill();
        canvasElement.stroke();
        this.m_DoRedraw = false;
      }
    }
    ownerSet(newOwner) {
      this.m_Owner = newOwner;
      this.m_Occupied = true;
    }
    neighboursGet(cells, definitions2) {
      const neighbours = [];
      definitions2.Offsets.forEach((currentOffset) => {
        const cellPosY = this.m_PosY + currentOffset.DY;
        if (cellPosY < 0 || definitions2.DimensionY <= cellPosY) {
          return;
        }
        const cellPosX = this.m_PosX + currentOffset.DX;
        if (cellPosX < 0 || definitions2.DimensionX <= cellPosX) {
          return;
        }
        const row = cells[cellPosY];
        if (!row) {
          return;
        }
        const currentNeighbour = row[cellPosX];
        if (!currentNeighbour) {
          return;
        }
        if (!currentNeighbour.m_DoRedraw) {
          return;
        }
        if (!currentNeighbour.m_Occupied && this.m_Color === currentNeighbour.m_Color || this.m_Owner === currentNeighbour.m_Owner && this.m_Color !== currentNeighbour.m_Color) {
          neighbours.push(currentNeighbour);
        }
      });
      return neighbours;
    }
    cellColorRandomGet(colors) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      return colors[colorIndex] ?? this.m_Color;
    }
    isBorderCell(cells, definitions2) {
      let isBorder = false;
      definitions2.Offsets.forEach((currentOffset) => {
        const cellPosY = this.m_PosY + currentOffset.DY;
        if (cellPosY < 0 || definitions2.DimensionY <= cellPosY) {
          return;
        }
        const cellPosX = this.m_PosX + currentOffset.DX;
        if (cellPosX < 0 || definitions2.DimensionX <= cellPosX) {
          return;
        }
        const row = cells[cellPosY];
        if (!row) {
          return;
        }
        const currentNeighbour = row[cellPosX];
        if (!currentNeighbour) {
          return;
        }
        if (!currentNeighbour.m_Occupied) {
          isBorder = true;
        }
      });
      return isBorder;
    }
  };

  // lcgrid.ts
  var LCGrid = class {
    constructor() {
      __publicField(this, "m_Cells");
      this.m_Cells = [];
    }
    gridInit(definitions2, canvasElement) {
      this.m_Cells = [];
      for (let loopY = 0; loopY < definitions2.DimensionY; loopY += 1) {
        const row = [];
        this.m_Cells[loopY] = row;
        for (let loopX = 0; loopX < definitions2.DimensionX; loopX += 1) {
          const currentCell = new LCCell(loopX, loopY);
          currentCell.m_Color = currentCell.cellColorRandomGet(definitions2.Colors);
          currentCell.draw(definitions2, canvasElement);
          row.push(currentCell);
        }
      }
    }
    gridReset() {
      this.m_Cells.forEach((currentRow) => {
        currentRow.forEach((currentCell) => {
          currentCell.m_DoRedraw = true;
        });
      });
    }
    getPlayerCells(player) {
      const playerCells = [];
      this.m_Cells.forEach((currentRow) => {
        currentRow.forEach((currentCell) => {
          if (currentCell.m_Owner === player.m_PlayerName) {
            playerCells.push(currentCell);
          }
        });
      });
      return playerCells;
    }
    identifyBorderCells(cells, definitions2) {
      const borderCells = [];
      cells.forEach((currentCell) => {
        if (currentCell.isBorderCell(this.m_Cells, definitions2)) {
          borderCells.push(currentCell);
        }
      });
      return borderCells;
    }
    playerColorsGet(cells, definitions2) {
      const playerColors = {};
      cells.forEach((currentCell) => {
        definitions2.Offsets.forEach((currentOffset) => {
          const cellPosY = currentCell.m_PosY + currentOffset.DY;
          if (cellPosY < 0 || definitions2.DimensionY <= cellPosY) {
            return;
          }
          const cellPosX = currentCell.m_PosX + currentOffset.DX;
          if (cellPosX < 0 || definitions2.DimensionX <= cellPosX) {
            return;
          }
          const row = this.m_Cells[cellPosY];
          if (!row) {
            return;
          }
          const currentNeighbour = row[cellPosX];
          if (!currentNeighbour) {
            return;
          }
          if (currentNeighbour.m_Occupied) {
            return;
          }
          const valueOld = playerColors[currentNeighbour.m_Color] || 0;
          playerColors[currentNeighbour.m_Color] = valueOld + 1;
        });
      });
      return playerColors;
    }
  };

  // strategies/simulateCapture.ts
  function simulateCapture(cells, definitions2, ownedSet, extraBlocked, color) {
    const newOwned = new Set(ownedSet);
    let frontier = Array.from(ownedSet);
    let gained = 0;
    while (frontier.length > 0) {
      const next = [];
      for (const cell of frontier) {
        for (const offset of definitions2.Offsets) {
          const ny = cell.m_PosY + offset.DY;
          const nx = cell.m_PosX + offset.DX;
          if (ny < 0 || ny >= definitions2.DimensionY || nx < 0 || nx >= definitions2.DimensionX) {
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

  // strategies/greedyStrategy.ts
  function chooseGreedyColor(input) {
    const {
      cells,
      definitions: definitions2,
      newColorPlayer,
      compPlayerName,
      humanPlayerName,
      compCurrentColor
    } = input;
    const compOwned = /* @__PURE__ */ new Set();
    const humanOwned = /* @__PURE__ */ new Set();
    const allColors = /* @__PURE__ */ new Set();
    cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.m_Owner === compPlayerName) {
          compOwned.add(cell);
        } else if (cell.m_Owner === humanPlayerName) {
          humanOwned.add(cell);
        }
        if (!cell.m_Occupied) {
          allColors.add(cell.m_Color);
        }
      });
    });
    let bestColor = compCurrentColor;
    let bestGain = -1;
    for (const compColor of allColors) {
      if (compColor === newColorPlayer || compColor === compCurrentColor) {
        continue;
      }
      const { gained } = simulateCapture(cells, definitions2, compOwned, humanOwned, compColor);
      if (gained > bestGain) {
        bestGain = gained;
        bestColor = compColor;
      }
    }
    return bestColor;
  }

  // strategies/minimaxStrategy.ts
  function chooseMinimaxColor(input) {
    const {
      cells,
      definitions: definitions2,
      newColorPlayer,
      compPlayerName,
      humanPlayerName,
      compCurrentColor,
      humanCurrentColor
    } = input;
    const DENY_WEIGHT = 1.2;
    const DIVERSITY_WEIGHT = 0.15;
    const compOwned = /* @__PURE__ */ new Set();
    const humanOwned = /* @__PURE__ */ new Set();
    const allColors = /* @__PURE__ */ new Set();
    cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.m_Owner === compPlayerName) {
          compOwned.add(cell);
        } else if (cell.m_Owner === humanPlayerName) {
          humanOwned.add(cell);
        }
        if (!cell.m_Occupied) {
          allColors.add(cell.m_Color);
        }
      });
    });
    let bestColor = compCurrentColor;
    let bestScore = -Infinity;
    for (const compColor of allColors) {
      if (compColor === newColorPlayer || compColor === compCurrentColor) {
        continue;
      }
      const { gained: compGain, newOwnedSet: compOwned2 } = simulateCapture(cells, definitions2, compOwned, humanOwned, compColor);
      const frontierColors = /* @__PURE__ */ new Set();
      for (const cell of compOwned2) {
        for (const offset of definitions2.Offsets) {
          const ny = cell.m_PosY + offset.DY;
          const nx = cell.m_PosX + offset.DX;
          if (ny < 0 || ny >= definitions2.DimensionY || nx < 0 || nx >= definitions2.DimensionX) {
            continue;
          }
          const neighbor = cells[ny]?.[nx];
          if (neighbor && !neighbor.m_Occupied && !compOwned2.has(neighbor) && !humanOwned.has(neighbor)) {
            frontierColors.add(neighbor.m_Color);
          }
        }
      }
      let bestHumanGain = 0;
      for (const humanColor of allColors) {
        if (humanColor === compColor || humanColor === humanCurrentColor) {
          continue;
        }
        const { gained: humanGain } = simulateCapture(cells, definitions2, humanOwned, compOwned2, humanColor);
        if (humanGain > bestHumanGain) {
          bestHumanGain = humanGain;
        }
      }
      const score = compGain - bestHumanGain * DENY_WEIGHT + frontierColors.size * DIVERSITY_WEIGHT;
      if (score > bestScore) {
        bestScore = score;
        bestColor = compColor;
      }
    }
    return bestColor;
  }

  // strategies/index.ts
  function chooseComputerColor(strategy, input) {
    if (strategy === "greedy") {
      return chooseGreedyColor(input);
    }
    return chooseMinimaxColor(input);
  }

  // util.ts
  function setElementSize(element, width, height) {
    if (!element) {
      return;
    }
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.width = width;
    element.height = height;
  }
  function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : "";
  }
  function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.value = String(value);
    }
  }
  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }
  function show(id, displayMode = "block") {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = displayMode;
    }
  }
  function hide(id) {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = "none";
    }
  }
  function removeClass(id, className) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.remove(className);
    }
  }
  function clearChildren(id) {
    const element = document.getElementById(id);
    if (element) {
      element.replaceChildren();
    }
  }
  function getCssNumberVar(name, fallback = 0) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  // lcplayer.ts
  var LCPlayer = class {
    constructor(playerName, idName, idScore) {
      __publicField(this, "m_PlayerName");
      __publicField(this, "m_BaseCell");
      __publicField(this, "m_Offsets");
      __publicField(this, "m_IDName");
      __publicField(this, "m_IDScore");
      __publicField(this, "m_IDWinner");
      this.m_PlayerName = playerName;
      this.m_BaseCell = null;
      this.m_Offsets = [];
      this.m_IDName = idName;
      this.m_IDScore = idScore;
      this.m_IDWinner = "";
    }
    counterUpdate(cells, definitions2) {
      let cellCounter = 0;
      cells.forEach((currentRow) => {
        currentRow.forEach((currentCell) => {
          if (currentCell.m_Occupied && this.m_PlayerName === currentCell.m_Owner) {
            cellCounter += 1;
          }
        });
      });
      setText(this.m_IDScore, String(cellCounter));
      if (cellCounter >= definitions2.Winner) {
        setText(
          this.m_IDWinner,
          `Player [${this.m_PlayerName}] won the game - has more than the half cells occupied.`
        );
        removeClass(this.m_IDWinner, "dspno");
      }
    }
    init(board2, posX, posY, idWinner) {
      setText(this.m_IDName, this.m_PlayerName);
      this.m_IDWinner = idWinner;
      const row = board2.m_Grid.m_Cells[posY];
      const baseCell = row ? row[posX] : void 0;
      if (!baseCell) {
        return;
      }
      this.m_BaseCell = baseCell;
      this.m_BaseCell.ownerSet(this.m_PlayerName);
      if (board2.m_CanvasElement) {
        this.m_BaseCell.draw(board2.m_Definitions, board2.m_CanvasElement);
        this.cellsMarkOwner(
          board2.m_Grid.m_Cells,
          board2.m_Definitions,
          board2.m_CanvasElement
        );
      }
    }
    move(cells, colors, definitions2, canvasElement) {
      if (!this.m_BaseCell || !canvasElement) {
        return;
      }
      this.m_BaseCell.m_Color = this.m_BaseCell.cellColorRandomGet(colors);
      this.m_BaseCell.draw(definitions2, canvasElement);
      this.cellsMarkOwner(cells, definitions2, canvasElement);
    }
    cellsMarkOwner(cells, definitions2, canvasElement) {
      if (!this.m_BaseCell) {
        return;
      }
      let cellsCollect = [];
      let cellsWork = this.m_BaseCell.neighboursGet(cells, definitions2);
      do {
        cellsWork.forEach((currentCell) => {
          if (!this.m_BaseCell) {
            return;
          }
          currentCell.m_Color = this.m_BaseCell.m_Color;
          currentCell.ownerSet(this.m_PlayerName);
          currentCell.draw(definitions2, canvasElement);
          const newNeighbours = currentCell.neighboursGet(cells, definitions2);
          newNeighbours.forEach((newCell) => {
            cellsCollect.push(newCell);
          });
        });
        cellsWork = cellsCollect.filter((value, index, self) => self.indexOf(value) === index);
        cellsCollect = [];
      } while (cellsWork.length > 0);
      this.counterUpdate(cells, definitions2);
    }
    identifyBestColor(cells, definitions2, newColorPlayer, opponent, strategy = "minimax") {
      if (!this.m_BaseCell || !opponent.m_BaseCell) {
        return newColorPlayer;
      }
      return chooseComputerColor(strategy, {
        cells,
        definitions: definitions2,
        newColorPlayer,
        compPlayerName: this.m_PlayerName,
        humanPlayerName: opponent.m_PlayerName,
        compCurrentColor: this.m_BaseCell.m_Color,
        humanCurrentColor: opponent.m_BaseCell.m_Color
      });
    }
  };

  // lcboard.ts
  var LCBoard = class {
    constructor(definitions2, playerHuman, playerComputer) {
      __publicField(this, "m_CanvasElement");
      __publicField(this, "m_Definitions");
      __publicField(this, "m_PlayerHuman");
      __publicField(this, "m_PlayerComputer");
      __publicField(this, "m_Grid");
      __publicField(this, "m_IDGameField");
      __publicField(this, "m_IDButtonField");
      __publicField(this, "m_IDWinner");
      __publicField(this, "m_ComputerStrategy");
      __publicField(this, "m_GameOver");
      this.m_CanvasElement = null;
      this.m_Definitions = definitions2;
      this.m_PlayerHuman = playerHuman;
      this.m_PlayerComputer = playerComputer;
      this.m_Grid = new LCGrid();
      this.m_IDGameField = "";
      this.m_IDButtonField = "";
      this.m_IDWinner = "";
      this.m_ComputerStrategy = "minimax";
      this.m_GameOver = false;
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
      const btnWidth = Math.floor(this.m_Definitions.DimensionX * this.m_Definitions.CellSize / 5);
      const btnHeight = Math.floor(
        (this.m_Definitions.DimensionY * this.m_Definitions.CellSize - (numberOfButtons + 1) * btnMargin) / numberOfButtons
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
      const newColorComputer = this.m_PlayerComputer.identifyBestColor(
        this.m_Grid.m_Cells,
        this.m_Definitions,
        newColorPlayer,
        this.m_PlayerHuman,
        this.m_ComputerStrategy
      );
      this.m_Grid.gridReset();
      this.m_PlayerComputer.move(
        this.m_Grid.m_Cells,
        [newColorComputer],
        this.m_Definitions,
        this.m_CanvasElement
      );
      this.evaluateGameState();
    }
    getScoreStats() {
      let human2 = 0;
      let computer2 = 0;
      let occupied = 0;
      this.m_Grid.m_Cells.forEach((row) => {
        row.forEach((cell) => {
          if (cell.m_Occupied) {
            occupied += 1;
          }
          if (cell.m_Owner === this.m_PlayerHuman.m_PlayerName) {
            human2 += 1;
          }
          if (cell.m_Owner === this.m_PlayerComputer.m_PlayerName) {
            computer2 += 1;
          }
        });
      });
      return {
        human: human2,
        computer: computer2,
        occupied,
        total: this.m_Definitions.DimensionX * this.m_Definitions.DimensionY
      };
    }
    endGame(message) {
      this.m_GameOver = true;
      setText(this.m_IDWinner, message);
      removeClass(this.m_IDWinner, "dspno");
      show(this.m_IDWinner, "block");
    }
    evaluateGameState() {
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
  };

  // app.ts
  var definitions = new LCDefinitions(30, 20, 15);
  var human = new LCPlayer("Besucher", "name_human", "score_human");
  var computer = new LCPlayer("DerPaul", "name_computer", "score_computer");
  var board = new LCBoard(definitions, human, computer);
  function initApp() {
    const compare = document.getElementById("compare");
    if (compare) {
      compare.style.display = "none";
    }
    board.init("gamearea", "playbuttons", "winner");
    const resetButton = document.getElementById("btn_reset");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        board.reInit("dimx", "dimy", "cellsize", "playername", "computerstrategy");
      });
    }
  }
  document.addEventListener("DOMContentLoaded", initApp);
})();
//# sourceMappingURL=app.js.map
