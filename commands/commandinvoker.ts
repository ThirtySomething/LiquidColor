import type { ICommand } from "./icommand.js";

export class CommandInvoker {
    private commands: ICommand[] = [];
    private undoStack: ICommand[] = [];

    execute(command: ICommand): void {
        command.execute();
        this.commands.push(command);
        this.undoStack = [];
    }

    undo(): void {
        if (this.commands.length === 0) {
            return;
        }

        const command = this.commands.pop();
        if (command) {
            command.undo();
            this.undoStack.push(command);
        }
    }

    redo(): void {
        if (this.undoStack.length === 0) {
            return;
        }

        const command = this.undoStack.pop();
        if (command) {
            command.execute();
            this.commands.push(command);
        }
    }

    getCommandHistory(): ICommand[] {
        return [...this.commands];
    }
}
