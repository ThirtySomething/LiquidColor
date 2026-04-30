import { describe, expect, it, vi } from "vitest";

import type { Board, BoardStateSnapshot } from "../src/board";
import { CommandPlayColor } from "../src/commands/commandplaycolor";

type BoardStub = {
    createStateSnapshot: ReturnType<typeof vi.fn>;
    cloneStateSnapshot: ReturnType<typeof vi.fn>;
    performMove: ReturnType<typeof vi.fn>;
    restoreStateSnapshot: ReturnType<typeof vi.fn>;
};

const createBoardStub = (): BoardStub => {
    const snapshotBefore: BoardStateSnapshot = {
        cells: [],
        phase: "inprogress",
        ui: {
            winnerText: "",
            winnerVisible: false,
            moveInfoText: "",
            moveInfoVisible: false
        },
        highscore: {
            humanWins: 0,
            computerWins: 0,
            draws: 0
        }
    };

    const snapshotAfter: BoardStateSnapshot = {
        ...snapshotBefore,
        phase: "gameover"
    };

    return {
        createStateSnapshot: vi
            .fn()
            .mockReturnValueOnce(snapshotBefore)
            .mockReturnValueOnce(snapshotAfter)
            .mockReturnValue(snapshotAfter),
        cloneStateSnapshot: vi.fn((snapshot: BoardStateSnapshot) => structuredClone(snapshot)),
        performMove: vi.fn(),
        restoreStateSnapshot: vi.fn()
    };
};

describe("CommandPlayColor", () => {
    it("captures before/after state on first execution", () => {
        const board = createBoardStub();
        const command = new CommandPlayColor(board as unknown as Board, "red");

        command.execute();

        expect(board.createStateSnapshot).toHaveBeenCalledTimes(2);
        expect(board.performMove).toHaveBeenCalledWith("red");
    });

    it("restores cached post-state on repeated execute", () => {
        const board = createBoardStub();
        const command = new CommandPlayColor(board as unknown as Board, "green");

        command.execute();
        command.execute();

        expect(board.performMove).toHaveBeenCalledTimes(1);
        expect(board.restoreStateSnapshot).toHaveBeenCalledTimes(1);
        expect(board.createStateSnapshot).toHaveBeenCalledTimes(2);
    });

    it("undo restores pre-move state after execution", () => {
        const board = createBoardStub();
        const command = new CommandPlayColor(board as unknown as Board, "blue");

        command.execute();
        command.undo();

        expect(board.restoreStateSnapshot).toHaveBeenCalledTimes(1);
    });

    it("undo before execute is a no-op", () => {
        const board = createBoardStub();
        const command = new CommandPlayColor(board as unknown as Board, "blue");

        command.undo();

        expect(board.restoreStateSnapshot).not.toHaveBeenCalled();
        expect(board.performMove).not.toHaveBeenCalled();
    });

    it("accepts invalid color payloads and forwards them to performMove", () => {
        const board = createBoardStub();
        const command = new CommandPlayColor(board as unknown as Board, "" as unknown as string);

        expect(() => command.execute()).not.toThrow();
        expect(board.performMove).toHaveBeenCalledWith("");
    });

    it("stores compact deltas with only changed cells", () => {
        const snapshotBefore: BoardStateSnapshot = {
            cells: [
                [
                    { color: "red", owner: "", occupied: false },
                    { color: "blue", owner: "", occupied: false }
                ]
            ],
            phase: "inprogress",
            ui: {
                winnerText: "",
                winnerVisible: false,
                moveInfoText: "",
                moveInfoVisible: false
            },
            highscore: {
                humanWins: 0,
                computerWins: 0,
                draws: 0
            }
        };

        const snapshotAfter: BoardStateSnapshot = {
            ...snapshotBefore,
            cells: [
                [
                    { color: "green", owner: "Human", occupied: true },
                    { color: "blue", owner: "", occupied: false }
                ]
            ]
        };

        const board: BoardStub = {
            createStateSnapshot: vi
                .fn()
                .mockReturnValueOnce(snapshotBefore)
                .mockReturnValueOnce(snapshotAfter)
                .mockReturnValue(snapshotAfter),
            cloneStateSnapshot: vi.fn((snapshot: BoardStateSnapshot) => structuredClone(snapshot)),
            performMove: vi.fn(),
            restoreStateSnapshot: vi.fn()
        };

        const command = new CommandPlayColor(board as unknown as Board, "green");
        command.execute();

        const internals = command as unknown as {
            redoDelta: {
                cells: Array<{ y: number; x: number; color: string; owner: string; occupied: boolean }>;
                phase?: BoardStateSnapshot["phase"];
                ui?: BoardStateSnapshot["ui"];
                highscore?: BoardStateSnapshot["highscore"];
            };
            undoDelta: {
                cells: Array<{ y: number; x: number; color: string; owner: string; occupied: boolean }>;
            };
        };

        expect(internals.redoDelta.cells).toEqual([{ y: 0, x: 0, color: "green", owner: "Human", occupied: true }]);
        expect(internals.redoDelta.phase).toBeUndefined();
        expect(internals.redoDelta.ui).toBeUndefined();
        expect(internals.redoDelta.highscore).toBeUndefined();
        expect(internals.undoDelta.cells).toEqual([{ y: 0, x: 0, color: "red", owner: "", occupied: false }]);
    });
});
