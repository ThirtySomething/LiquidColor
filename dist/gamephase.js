class SetupPhase {
    name = "setup";
    canAcceptMove() {
        return false;
    }
    isOver() {
        return false;
    }
}
class InProgressPhase {
    name = "inprogress";
    canAcceptMove() {
        return true;
    }
    isOver() {
        return false;
    }
}
class GameOverPhase {
    name = "gameover";
    canAcceptMove() {
        return false;
    }
    isOver() {
        return true;
    }
}
export const GamePhase = {
    Setup: () => new SetupPhase(),
    InProgress: () => new InProgressPhase(),
    GameOver: () => new GameOverPhase(),
    from(name) {
        if (name === "inprogress") {
            return new InProgressPhase();
        }
        if (name === "gameover") {
            return new GameOverPhase();
        }
        return new SetupPhase();
    }
};
