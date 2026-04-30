import { describe, expect, it, vi } from "vitest";

import type { Board, BoardStateSnapshot } from "../board";
import { CommandPlayColor } from "../commands/commandplaycolor";

type BoardStub = {
    createStateSnapshot: ReturnType<typeof vi.fn>;
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
        createStateSnapshot: vi.fn()
            .mockReturnValueOnce(snapshotBefore)
            .mockReturnValueOnce(snapshotAfter),
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
});
