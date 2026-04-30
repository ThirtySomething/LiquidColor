import { beforeEach, describe, expect, it, vi } from "vitest";

import { type BoardHighscore, type BoardTimer, Board } from "../src/board";
import { Cell } from "../src/cell";
import { Definitions } from "../src/definitions";
import { GamePhase } from "../src/gamephase";
import { Player } from "../src/player";
import type { RandomSource } from "../src/randomsource";
import { createMockCanvasContext } from "./test-utils";

const setupDom = (): HTMLCanvasElement => {
    document.body.innerHTML = `
        <canvas id="gamearea"></canvas>
        <div id="playbuttons"></div>
        <p id="winner" class="dspno" style="display:none"></p>
        <p id="moveinfo" style="display:none"></p>
        <p id="gameduration"></p>
        <span id="name_human"></span>
        <span id="score_human"></span>
        <span id="name_computer"></span>
        <span id="score_computer"></span>
        <input id="dimx" value="2">
        <input id="dimy" value="2">
        <input id="cellsize" value="10">
        <input id="playername" value="Human">
        <select id="computerstrategy"><option value="minimax" selected>minimax</option></select>
        <span id="highscore_name_human"></span>
        <span id="highscore_name_computer"></span>
        <span id="highscore_human"></span>
        <span id="highscore_computer"></span>
        <span id="highscore_draws"></span>
        <span id="highscore_total"></span>
    `;

    const canvas = document.getElementById("gamearea") as HTMLCanvasElement;
    (canvas as unknown as { getContext: () => CanvasRenderingContext2D }).getContext = () => createMockCanvasContext();
    return canvas;
};

const resetBoardSingleton = (): void => {
    (Board as unknown as { instance: Board | null }).instance = null;
};

const createBoard = (): Board => {
    localStorage.clear();
    setupDom();
    Definitions.initialize(2, 2, 10);
    const definitions = Definitions.getInstance();
    const human = new Player("Human", "name_human", "score_human", () => undefined);
    const computer = new Player("CPU", "name_computer", "score_computer", () => undefined);
    resetBoardSingleton();
    Board.initialize(definitions, human, computer);
    const board = Board.getInstance();

    vi.spyOn(board.m_Timer, "startTicker").mockImplementation(() => undefined);
    vi.spyOn(board.m_Timer, "reset").mockImplementation(() => undefined);
    vi.spyOn(board.m_Timer, "startCounting").mockImplementation(() => undefined);
    vi.spyOn(board.m_Timer, "stop").mockImplementation(() => undefined);

    board.init("gamearea", "playbuttons", "winner");
    return board;
};

describe("Board", () => {
    beforeEach(() => {
        resetBoardSingleton();
    });

    it("throws when getInstance called before initialize", () => {
        expect(() => Board.getInstance()).toThrowError("Board not initialized");
    });

    it("initializes board and creates color buttons", () => {
        const board = createBoard();
        const playButtons = document.getElementById("playbuttons");

        expect(board.m_CanvasElement).not.toBeNull();
        expect(playButtons?.children.length).toBe(Definitions.getInstance().Colors.length);
    });

    it("board button click executes command through invoker", () => {
        const board = createBoard();
        const executeSpy = vi.spyOn(board.getCommandInvoker(), "execute");

        const firstButton = document.querySelector("#playbuttons button") as HTMLButtonElement;
        firstButton.click();

        expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it("boardButtonsInit no-ops when container does not exist", () => {
        const board = createBoard();
        expect(() => board.boardButtonsInit("missing-container")).not.toThrow();
    });

    it("reInit sanitizes name and strategy and refreshes board", () => {
        const board = createBoard();

        const playerName = document.getElementById("playername") as HTMLInputElement;
        playerName.value = "   ";

        const strategy = document.getElementById("computerstrategy") as HTMLSelectElement;
        strategy.value = "unknown";

        board.reInit("dimx", "dimy", "cellsize", "playername", "computerstrategy");

        expect(board.m_PlayerHuman.m_PlayerName).toBe("Besucher");
        expect(board.m_ComputerStrategy).toBe("minimax");
    });

    it("reInit clamps out-of-range numeric values from input fields", () => {
        const board = createBoard();

        (document.getElementById("dimx") as HTMLInputElement).value = "1";
        (document.getElementById("dimy") as HTMLInputElement).value = "999";
        (document.getElementById("cellsize") as HTMLInputElement).value = "-10";

        board.reInit("dimx", "dimy", "cellsize", "playername", "computerstrategy");

        expect(board.m_Definitions.DimensionX).toBe(2);
        expect(board.m_Definitions.DimensionY).toBe(200);
        expect(board.m_Definitions.CellSize).toBe(2);
    });

    it("reInit with missing field ids keeps dimensions and applies safe defaults", () => {
        const board = createBoard();
        const previous = {
            x: board.m_Definitions.DimensionX,
            y: board.m_Definitions.DimensionY,
            size: board.m_Definitions.CellSize
        };

        board.reInit("missing-x", "missing-y", "missing-size", "missing-name", "missing-strategy");

        expect(board.m_Definitions.DimensionX).toBe(previous.x);
        expect(board.m_Definitions.DimensionY).toBe(previous.y);
        expect(board.m_Definitions.CellSize).toBe(previous.size);
        expect(board.m_PlayerHuman.m_PlayerName).toBe("Besucher");
        expect(board.m_ComputerStrategy).toBe("minimax");
    });

    it("performMove shows validation messages for illegal colors", () => {
        const board = createBoard();
        if (board.m_PlayerHuman.m_BaseCell) {
            board.m_PlayerHuman.m_BaseCell.m_Color = "red";
        }
        if (board.m_PlayerComputer.m_BaseCell) {
            board.m_PlayerComputer.m_BaseCell.m_Color = "blue";
        }
        const humanColor = board.m_PlayerHuman.m_BaseCell?.m_Color as string;
        board.performMove(humanColor);

        expect(document.getElementById("moveinfo")?.textContent).toContain("cannot select the color of yourself");

        const computerColor = board.m_PlayerComputer.m_BaseCell?.m_Color as string;
        board.performMove(computerColor);
        expect(document.getElementById("moveinfo")?.textContent).toContain("cannot select the color of your opponent");
    });

    it("performMove exits when game is over or bases are missing", () => {
        const board = createBoard();
        board.m_Phase = GamePhase.GameOver();
        const humanMoveSpy = vi.spyOn(board.m_PlayerHuman, "move");

        board.performMove("red");
        expect(humanMoveSpy).not.toHaveBeenCalled();

        board.m_Phase = GamePhase.InProgress();
        board.m_PlayerHuman.m_BaseCell = null;
        board.performMove("blue");
        expect(humanMoveSpy).not.toHaveBeenCalled();
    });

    it("createStateSnapshot and restoreStateSnapshot preserve game state", () => {
        const board = createBoard();

        const snapshot = board.createStateSnapshot();
        board.m_Phase = GamePhase.GameOver();
        const winner = document.getElementById("winner") as HTMLElement;
        winner.textContent = "Changed";
        winner.classList.remove("dspno");
        winner.style.display = "block";

        board.restoreStateSnapshot(snapshot);

        expect(board.m_Phase.name).toBe(snapshot.phase);
        expect(document.getElementById("winner")?.textContent).toBe(snapshot.ui.winnerText);
    });

    it("getScoreStats counts human/computer/occupied cells", () => {
        const board = createBoard();

        const cells = board.m_Grid.m_Cells;
        cells[0][0].m_Occupied = true;
        cells[0][0].m_Owner = board.m_PlayerHuman.m_PlayerName;
        cells[0][1].m_Occupied = true;
        cells[0][1].m_Owner = board.m_PlayerComputer.m_PlayerName;

        const stats = board.getScoreStats();
        expect(stats.human).toBeGreaterThanOrEqual(1);
        expect(stats.computer).toBeGreaterThanOrEqual(1);
        expect(stats.occupied).toBeGreaterThanOrEqual(2);
        expect(stats.total).toBe(board.m_Definitions.DimensionX * board.m_Definitions.DimensionY);
    });

    it("endGame updates winner text, flags, and highscore", () => {
        const board = createBoard();

        const recordWinSpy = vi.spyOn(board.m_Highscore, "recordWin");
        board.endGame("Done", "human");

        expect(board.m_Phase.isOver()).toBe(true);
        expect(recordWinSpy).toHaveBeenCalledWith("human");
        expect(document.getElementById("winner")?.textContent).toBe("Done");
    });

    it("evaluateGameState handles all end conditions and non-terminal state", () => {
        const board = createBoard();
        const endGameSpy = vi.spyOn(board, "endGame").mockImplementation(() => undefined);

        vi.spyOn(board, "getScoreStats").mockReturnValue({
            human: board.m_Definitions.Winner,
            computer: 0,
            occupied: 0,
            total: 4
        });
        expect(board.evaluateGameState()).toBe(true);

        vi.spyOn(board, "getScoreStats").mockReturnValue({
            human: 0,
            computer: board.m_Definitions.Winner,
            occupied: 0,
            total: 4
        });
        expect(board.evaluateGameState()).toBe(true);

        vi.spyOn(board, "getScoreStats").mockReturnValue({ human: 2, computer: 2, occupied: 4, total: 4 });
        expect(board.evaluateGameState()).toBe(true);

        vi.spyOn(board, "getScoreStats").mockReturnValue({ human: 2, computer: 1, occupied: 4, total: 4 });
        expect(board.evaluateGameState()).toBe(true);

        vi.spyOn(board, "getScoreStats").mockReturnValue({ human: 1, computer: 2, occupied: 4, total: 4 });
        expect(board.evaluateGameState()).toBe(true);

        vi.spyOn(board, "getScoreStats").mockReturnValue({ human: 1, computer: 1, occupied: 2, total: 4 });
        expect(board.evaluateGameState()).toBe(false);

        expect(endGameSpy).toHaveBeenCalled();
    });

    it("performMove returns early when first evaluate call ends game", () => {
        const board = createBoard();
        if (board.m_PlayerHuman.m_BaseCell) {
            board.m_PlayerHuman.m_BaseCell.m_Color = "red";
        }
        if (board.m_PlayerComputer.m_BaseCell) {
            board.m_PlayerComputer.m_BaseCell.m_Color = "blue";
        }

        const humanMoveSpy = vi.spyOn(board.m_PlayerHuman, "move").mockImplementation(() => undefined);
        const computerMoveSpy = vi.spyOn(board.m_PlayerComputer, "move").mockImplementation(() => undefined);
        vi.spyOn(board.m_PlayerComputer, "identifyBestColor").mockReturnValue("green");
        vi.spyOn(board, "evaluateGameState").mockReturnValueOnce(true);

        board.performMove("green");

        expect(humanMoveSpy).toHaveBeenCalled();
        expect(computerMoveSpy).not.toHaveBeenCalled();
    });

    it("performMove executes full human+computer flow when game continues", () => {
        const board = createBoard();
        if (board.m_PlayerHuman.m_BaseCell) {
            board.m_PlayerHuman.m_BaseCell.m_Color = "red";
        }
        if (board.m_PlayerComputer.m_BaseCell) {
            board.m_PlayerComputer.m_BaseCell.m_Color = "blue";
        }

        const humanMoveSpy = vi.spyOn(board.m_PlayerHuman, "move").mockImplementation(() => undefined);
        const computerMoveSpy = vi.spyOn(board.m_PlayerComputer, "move").mockImplementation(() => undefined);
        const identifySpy = vi.spyOn(board.m_PlayerComputer, "identifyBestColor").mockReturnValue("green");
        const evaluateSpy = vi.spyOn(board, "evaluateGameState").mockReturnValueOnce(false).mockReturnValueOnce(false);

        board.performMove("green");

        expect(humanMoveSpy).toHaveBeenCalledTimes(1);
        expect(identifySpy).toHaveBeenCalledTimes(1);
        expect(computerMoveSpy).toHaveBeenCalledTimes(1);
        expect(evaluateSpy).toHaveBeenCalledTimes(2);
    });

    it("readComputerStrategy accepts greedy and defaults to minimax", () => {
        const board = createBoard();
        expect(board.readComputerStrategy("greedy")).toBe("greedy");
        expect(board.readComputerStrategy("x")).toBe("minimax");
        expect(board.readComputerStrategy("GREEDY")).toBe("minimax");
    });

    it("getUISubject returns the board's subject", () => {
        const board = createBoard();
        const subject = board.getUISubject();

        const received: unknown[] = [];
        subject.attach({ update: (d) => received.push(d) });
        subject.notify({ type: "winner", player: "P" });

        expect(received).toHaveLength(1);
    });

    it("restoreStateSnapshot skips rows absent from the grid", () => {
        const board = createBoard();
        board.m_Grid.m_Cells = [[new Cell(0, 0)]];

        const extraRowSnapshot = {
            cells: [
                [{ color: "red", owner: "Human", occupied: true }],
                [{ color: "blue", owner: "CPU", occupied: true }]
            ],
            phase: "inprogress" as const,
            ui: { winnerText: "", winnerVisible: false, moveInfoText: "", moveInfoVisible: false },
            highscore: { humanWins: 0, computerWins: 0, draws: 0 }
        };

        expect(() => board.restoreStateSnapshot(extraRowSnapshot)).not.toThrow();
        expect(board.m_Grid.m_Cells[0][0].m_Color).toBe("red");
    });

    it("restoreStateSnapshot resolves base cells to null when grid has no rows", () => {
        const board = createBoard();
        board.m_Grid.m_Cells = [];

        const emptySnapshot = {
            cells: [],
            phase: "inprogress" as const,
            ui: { winnerText: "", winnerVisible: false, moveInfoText: "", moveInfoVisible: false },
            highscore: { humanWins: 0, computerWins: 0, draws: 0 }
        };

        board.restoreStateSnapshot(emptySnapshot);

        expect(board.m_PlayerHuman.m_BaseCell).toBeNull();
        expect(board.m_PlayerComputer.m_BaseCell).toBeNull();
    });

    it("init exits gracefully when context is unavailable", () => {
        localStorage.clear();
        setupDom();
        const canvas = document.getElementById("gamearea") as HTMLCanvasElement;
        (canvas as unknown as { getContext: () => null }).getContext = () => null;

        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const human = new Player("Human", "name_human", "score_human", () => undefined);
        const computer = new Player("CPU", "name_computer", "score_computer", () => undefined);

        Board.initialize(definitions, human, computer);
        const board = Board.getInstance();

        expect(() => board.init("gamearea", "playbuttons", "winner")).not.toThrow();
    });

    it("restoreStateSnapshot updates winner display hidden state", () => {
        const board = createBoard();
        const snapshot = board.createStateSnapshot();

        const shown = {
            ...snapshot,
            ui: {
                ...snapshot.ui,
                winnerText: "Shown",
                winnerVisible: true,
                moveInfoVisible: true,
                moveInfoText: "hello"
            }
        };

        board.restoreStateSnapshot(shown);
        const winner = document.getElementById("winner") as HTMLElement;
        expect(winner.textContent).toBe("Shown");
        expect(winner.style.display).toBe("block");

        board.restoreStateSnapshot(snapshot);
        expect(winner.style.display).toBe("none");
    });

    it("restoreStateSnapshot tolerates sparse snapshot and grid data", () => {
        const board = createBoard();
        board.m_Grid.m_Cells = [[new Cell(0, 0)]];

        const sparseSnapshot = {
            cells: [
                [
                    { color: "red", owner: "Human", occupied: true },
                    { color: "blue", owner: "CPU", occupied: true }
                ]
            ],
            phase: "inprogress" as const,
            ui: { winnerText: "", winnerVisible: false, moveInfoText: "", moveInfoVisible: false },
            highscore: { humanWins: 0, computerWins: 0, draws: 0 }
        };

        expect(() => board.restoreStateSnapshot(sparseSnapshot)).not.toThrow();
        expect(board.m_PlayerComputer.m_BaseCell).toBeNull();
    });

    it("boardInit exits when canvas context is missing", () => {
        const board = createBoard();
        board.m_CanvasElement = null;

        expect(() => board.boardInit()).not.toThrow();
    });

    it("createStateSnapshot falls back when winner and moveinfo elements are missing", () => {
        const board = createBoard();
        const winner = document.getElementById("winner");
        const moveinfo = document.getElementById("moveinfo");
        winner?.remove();
        moveinfo?.remove();

        const snapshot = board.createStateSnapshot();

        expect(snapshot.ui.winnerText).toBe("");
        expect(snapshot.ui.winnerVisible).toBe(false);
        expect(snapshot.ui.moveInfoText).toBe("");
        expect(snapshot.ui.moveInfoVisible).toBe(false);
    });

    it("restoreStateSnapshot handles existing but empty base rows", () => {
        const board = createBoard();
        board.m_Grid.m_Cells = [[], []];

        const snapshot = {
            cells: [[], []],
            phase: "inprogress" as const,
            ui: { winnerText: "", winnerVisible: false, moveInfoText: "", moveInfoVisible: false },
            highscore: { humanWins: 0, computerWins: 0, draws: 0 }
        };

        board.restoreStateSnapshot(snapshot);

        expect(board.m_PlayerHuman.m_BaseCell).toBeNull();
        expect(board.m_PlayerComputer.m_BaseCell).toBeNull();
    });

    it("accepts injected timer, highscore, and random source interfaces", () => {
        localStorage.clear();
        setupDom();
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const human = new Player("Human", "name_human", "score_human", () => undefined);
        const computer = new Player("CPU", "name_computer", "score_computer", () => undefined);
        const timer: BoardTimer = {
            reset: vi.fn(),
            startTicker: vi.fn(),
            startCounting: vi.fn(),
            stop: vi.fn()
        };
        const highscore: BoardHighscore = {
            recordWin: vi.fn(),
            render: vi.fn((humanName: string, computerName: string) => {
                document.getElementById("highscore_name_human")!.textContent = humanName;
                document.getElementById("highscore_name_computer")!.textContent = computerName;
                document.getElementById("highscore_human")!.textContent = "2";
                document.getElementById("highscore_computer")!.textContent = "1";
                document.getElementById("highscore_draws")!.textContent = "3";
                document.getElementById("highscore_total")!.textContent = "6";
            }),
            createSnapshot: vi.fn(() => ({ humanWins: 2, computerWins: 1, draws: 3 })),
            restoreSnapshot: vi.fn()
        };
        const randomSource: RandomSource = { next: vi.fn(() => 0) };
        resetBoardSingleton();
        Board.initialize(definitions, human, computer, {
            timer,
            highscore,
            randomSource
        });
        const board = Board.getInstance();
        board.init("gamearea", "playbuttons", "winner");

        expect(board.m_Timer).toBe(timer);
        expect(board.m_Highscore).toBe(highscore);
        expect(board.m_RandomSource).toBe(randomSource);
        expect(highscore.render).toHaveBeenCalledWith("Human", "CPU");
        expect(timer.reset).toHaveBeenCalled();
        expect(timer.startTicker).toHaveBeenCalled();
        expect(document.getElementById("highscore_total")?.textContent).toBe("6");
        expect(randomSource.next).toHaveBeenCalled();
    });

    describe("game phase transitions", () => {
        it("phase starts as setup before init is called", () => {
            localStorage.clear();
            setupDom();
            Definitions.initialize(2, 2, 10);
            const definitions = Definitions.getInstance();
            const human = new Player("Human", "name_human", "score_human", () => undefined);
            const computer = new Player("CPU", "name_computer", "score_computer", () => undefined);
            Board.initialize(definitions, human, computer);
            const board = Board.getInstance();

            expect(board.m_Phase.name).toBe("setup");
            expect(board.m_Phase.canAcceptMove()).toBe(false);
            expect(board.m_Phase.isOver()).toBe(false);
        });

        it("phase is inprogress after board init", () => {
            const board = createBoard();
            expect(board.m_Phase.name).toBe("inprogress");
            expect(board.m_Phase.canAcceptMove()).toBe(true);
            expect(board.m_Phase.isOver()).toBe(false);
        });

        it("transitions to gameover after endGame", () => {
            const board = createBoard();
            board.endGame("Done", "human");
            expect(board.m_Phase.name).toBe("gameover");
            expect(board.m_Phase.canAcceptMove()).toBe(false);
            expect(board.m_Phase.isOver()).toBe(true);
        });

        it("transitions back to inprogress after reInit", () => {
            const board = createBoard();
            board.endGame("Done", "human");
            board.reInit("dimx", "dimy", "cellsize", "playername", "computerstrategy");
            expect(board.m_Phase.name).toBe("inprogress");
        });
    });
});
