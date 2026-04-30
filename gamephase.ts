import type { GamePhaseName } from "./types/gamephasename.js";
import type { IGamePhase } from "./types/igamephase.js";

export type { GamePhaseName } from "./types/gamephasename.js";
export type { IGamePhase } from "./types/igamephase.js";

class SetupPhase implements IGamePhase {
    readonly name = "setup" as const;

    canAcceptMove(): boolean {
        return false;
    }

    isOver(): boolean {
        return false;
    }
}

class InProgressPhase implements IGamePhase {
    readonly name = "inprogress" as const;

    canAcceptMove(): boolean {
        return true;
    }

    isOver(): boolean {
        return false;
    }
}

class GameOverPhase implements IGamePhase {
    readonly name = "gameover" as const;

    canAcceptMove(): boolean {
        return false;
    }

    isOver(): boolean {
        return true;
    }
}

export const GamePhase = {
    Setup: (): IGamePhase => new SetupPhase(),
    InProgress: (): IGamePhase => new InProgressPhase(),
    GameOver: (): IGamePhase => new GameOverPhase(),
    from(name: GamePhaseName): IGamePhase {
        if (name === "inprogress") {
            return new InProgressPhase();
        }
        if (name === "gameover") {
            return new GameOverPhase();
        }
        return new SetupPhase();
    }
};
