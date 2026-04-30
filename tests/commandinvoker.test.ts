import { describe, expect, it, vi } from "vitest";

import { CommandInvoker } from "../commands/commandinvoker";
import type { ICommand } from "../commands/icommand";

const makeCommand = (): ICommand & { executeSpy: ReturnType<typeof vi.fn>; undoSpy: ReturnType<typeof vi.fn> } => {
    const executeSpy = vi.fn();
    const undoSpy = vi.fn();
    return {
        execute: executeSpy,
        undo: undoSpy,
        executeSpy,
        undoSpy
    };
};

describe("CommandInvoker", () => {
    it("executes command and stores it in history", () => {
        const invoker = new CommandInvoker();
        const command = makeCommand();

        invoker.execute(command);

        expect(command.executeSpy).toHaveBeenCalledTimes(1);
        expect(invoker.getCommandHistory()).toHaveLength(1);
    });

    it("undoes and redoes the most recent command", () => {
        const invoker = new CommandInvoker();
        const command = makeCommand();

        invoker.execute(command);
        invoker.undo();
        invoker.redo();

        expect(command.undoSpy).toHaveBeenCalledTimes(1);
        expect(command.executeSpy).toHaveBeenCalledTimes(2);
        expect(invoker.getCommandHistory()).toHaveLength(1);
    });

    it("caps command history at MAX_HISTORY", () => {
        const invoker = new CommandInvoker();

        for (let i = 0; i < 20; i += 1) {
            invoker.execute(makeCommand());
        }

        expect(invoker.getCommandHistory()).toHaveLength(15);
    });

    it("clears redo stack when new command is executed", () => {
        const invoker = new CommandInvoker();
        const first = makeCommand();
        const second = makeCommand();

        invoker.execute(first);
        invoker.undo();
        invoker.execute(second);
        invoker.redo();

        expect(first.executeSpy).toHaveBeenCalledTimes(1);
        expect(second.executeSpy).toHaveBeenCalledTimes(1);
        expect(invoker.getCommandHistory()).toHaveLength(1);
    });

    it("supports execute without history tracking", () => {
        const invoker = new CommandInvoker();
        const command = makeCommand();

        invoker.execute(command, false);

        expect(command.executeSpy).toHaveBeenCalledTimes(1);
        expect(invoker.getCommandHistory()).toHaveLength(0);
    });

    it("undo and redo are no-ops when stacks are empty", () => {
        const invoker = new CommandInvoker();

        expect(() => {
            invoker.undo();
            invoker.redo();
        }).not.toThrow();
    });

    it("clearHistory removes command and undo stacks", () => {
        const invoker = new CommandInvoker();
        const command = makeCommand();

        invoker.execute(command);
        invoker.undo();
        invoker.clearHistory();
        invoker.redo();

        expect(command.executeSpy).toHaveBeenCalledTimes(1);
        expect(invoker.getCommandHistory()).toHaveLength(0);
    });
});
