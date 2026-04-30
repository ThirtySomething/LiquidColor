import { describe, expect, it } from "vitest";

import { GamePhase } from "../gamephase";

describe("GamePhase", () => {
    it("SetupPhase cannot accept moves and is not over", () => {
        const phase = GamePhase.Setup();
        expect(phase.name).toBe("setup");
        expect(phase.canAcceptMove()).toBe(false);
        expect(phase.isOver()).toBe(false);
    });

    it("InProgressPhase can accept moves and is not over", () => {
        const phase = GamePhase.InProgress();
        expect(phase.name).toBe("inprogress");
        expect(phase.canAcceptMove()).toBe(true);
        expect(phase.isOver()).toBe(false);
    });

    it("GameOverPhase cannot accept moves and is over", () => {
        const phase = GamePhase.GameOver();
        expect(phase.name).toBe("gameover");
        expect(phase.canAcceptMove()).toBe(false);
        expect(phase.isOver()).toBe(true);
    });

    it("GamePhase.from reconstructs each phase by name", () => {
        expect(GamePhase.from("setup").name).toBe("setup");
        expect(GamePhase.from("setup").canAcceptMove()).toBe(false);
        expect(GamePhase.from("setup").isOver()).toBe(false);

        expect(GamePhase.from("inprogress").name).toBe("inprogress");
        expect(GamePhase.from("inprogress").canAcceptMove()).toBe(true);
        expect(GamePhase.from("inprogress").isOver()).toBe(false);

        expect(GamePhase.from("gameover").name).toBe("gameover");
        expect(GamePhase.from("gameover").canAcceptMove()).toBe(false);
        expect(GamePhase.from("gameover").isOver()).toBe(true);
    });
});
