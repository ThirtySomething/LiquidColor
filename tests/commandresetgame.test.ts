import { describe, expect, it, vi } from "vitest";

import type { Board } from "../src/board";
import { CommandResetGame } from "../src/commands/commandresetgame";

describe("CommandResetGame", () => {
    it("execute calls board.reInit with configured ids", () => {
        const board = {
            reInit: vi.fn()
        } as unknown as Board;

        const command = new CommandResetGame(board, "x", "y", "size", "name", "strategy");
        command.execute();

        expect((board as unknown as { reInit: ReturnType<typeof vi.fn> }).reInit).toHaveBeenCalledWith(
            "x",
            "y",
            "size",
            "name",
            "strategy"
        );
    });

    it("undo currently logs placeholder message", () => {
        const board = { reInit: vi.fn() } as unknown as Board;
        const command = new CommandResetGame(board, "x", "y", "size", "name", "strategy");
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

        command.undo();

        expect(logSpy).toHaveBeenCalledWith("Undo reset game");
    });
});
