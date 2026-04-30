export class CommandInvoker {
    commands = [];
    undoStack = [];
    execute(command, trackHistory = true) {
        command.execute();
        if (!trackHistory) {
            return;
        }
        this.commands.push(command);
        this.undoStack = [];
    }
    undo() {
        if (this.commands.length === 0) {
            return;
        }
        const command = this.commands.pop();
        if (command) {
            command.undo();
            this.undoStack.push(command);
        }
    }
    redo() {
        if (this.undoStack.length === 0) {
            return;
        }
        const command = this.undoStack.pop();
        if (command) {
            command.execute();
            this.commands.push(command);
        }
    }
    getCommandHistory() {
        return [...this.commands];
    }
    clearHistory() {
        this.commands = [];
        this.undoStack = [];
    }
}
