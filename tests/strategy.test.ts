import { describe, expect, it, vi } from "vitest";

import { Cell } from "../src/cell";
import { Definitions } from "../src/definitions";
import type { RandomSource } from "../src/randomsource";
import { CaptureSimulator } from "../src/strategies/capturesimulator";
import { ComputerStrategyFactory } from "../src/strategies/computerstrategyfactory";
import { StrategyGreedy } from "../src/strategies/strategygreedy";
import type { StrategyInput } from "../src/strategies/strategyinput";
import { StrategyMinimax } from "../src/strategies/strategyminimax";

const buildOwnedGrid = (): { input: StrategyInput; colors: string[] } => {
    Definitions.initialize(3, 2, 10);
    const definitions = Definitions.getInstance();
    const colors = ["red", "green", "blue", "yellow"];

    const cells = [
        [new Cell(0, 0), new Cell(1, 0), new Cell(2, 0)],
        [new Cell(0, 1), new Cell(1, 1), new Cell(2, 1)]
    ];

    cells[0][0].m_Owner = "CPU";
    cells[0][0].m_Occupied = true;
    cells[0][0].m_Color = "red";

    cells[1][2].m_Owner = "Human";
    cells[1][2].m_Occupied = true;
    cells[1][2].m_Color = "green";

    cells[0][1].m_Color = "blue";
    cells[1][0].m_Color = "blue";
    cells[0][2].m_Color = "yellow";
    cells[1][1].m_Color = "yellow";

    const input: StrategyInput = {
        cells,
        definitions,
        newColorPlayer: "green",
        compPlayerName: "CPU",
        humanPlayerName: "Human",
        compCurrentColor: "red",
        humanCurrentColor: "green"
    };

    return { input, colors };
};

describe("Strategies", () => {
    it("factory creates greedy and minimax implementations", () => {
        expect(ComputerStrategyFactory.create("greedy")).toBeInstanceOf(StrategyGreedy);
        expect(ComputerStrategyFactory.create("minimax")).toBeInstanceOf(StrategyMinimax);
    });

    it("chooseComputerColor delegates to strategy", () => {
        const { input } = buildOwnedGrid();
        const color = ComputerStrategyFactory.chooseComputerColor("greedy", input);
        expect(typeof color).toBe("string");
    });

    it("greedy chooses color with max immediate gain among legal colors", () => {
        const { input } = buildOwnedGrid();

        const greedy = new StrategyGreedy();
        const selected = greedy.chooseColor(input);

        expect(["blue", "yellow", "red"]).toContain(selected);
        expect(selected).not.toBe("green");
    });

    it("minimax chooses legal color and avoids forbidden selections", () => {
        const { input } = buildOwnedGrid();

        const minimax = new StrategyMinimax();
        const selected = minimax.chooseColor(input);

        expect(["blue", "yellow", "red"]).toContain(selected);
        expect(selected).not.toBe(input.newColorPlayer);
        expect(selected).not.toBe(input.compCurrentColor);
    });

    it("strategies skip forbidden candidate colors", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const cells = [
            [new Cell(0, 0), new Cell(1, 0)],
            [new Cell(0, 1), new Cell(1, 1)]
        ];

        cells[0][0].m_Owner = "CPU";
        cells[0][0].m_Occupied = true;
        cells[0][0].m_Color = "red";

        cells[1][1].m_Owner = "Human";
        cells[1][1].m_Occupied = true;
        cells[1][1].m_Color = "green";

        cells[0][1].m_Color = "red";
        cells[0][1].m_Occupied = false;
        cells[1][0].m_Color = "green";
        cells[1][0].m_Occupied = false;

        const input: StrategyInput = {
            cells,
            definitions,
            newColorPlayer: "green",
            compPlayerName: "CPU",
            humanPlayerName: "Human",
            compCurrentColor: "red",
            humanCurrentColor: "green"
        };

        expect(new StrategyGreedy().chooseColor(input)).toBe("red");
        expect(new StrategyMinimax().chooseColor(input)).toBe("red");
    });

    it("factory accepts injected random source for AI tie-breaking", () => {
        const { input } = buildOwnedGrid();
        const randomSource: RandomSource = { next: () => 1 };

        const color = ComputerStrategyFactory.chooseComputerColor("greedy", input, randomSource);

        expect(["blue", "yellow", "red"]).toContain(color);
        expect(color).not.toBe("green");
    });

    it("greedy tie-break uses random source when gains are equal", () => {
        const { input } = buildOwnedGrid();
        const randomSource: RandomSource = { next: () => 1 };
        const spy = vi.spyOn(CaptureSimulator, "simulate").mockReturnValue({
            gained: 1,
            newOwnedSet: new Set<Cell>()
        });

        const selected = new StrategyGreedy(randomSource).chooseColor(input);

        expect(selected).toBe("yellow");
        expect(spy).toHaveBeenCalled();
    });

    it("minimax tie-break uses random source when scores are equal", () => {
        const { input } = buildOwnedGrid();
        const randomSource: RandomSource = { next: () => 1 };
        const spy = vi.spyOn(CaptureSimulator, "simulate").mockImplementation((_, __, owned) => {
            if (owned.has(input.cells[0][0])) {
                return { gained: 0, newOwnedSet: new Set<Cell>() };
            }
            return { gained: 0, newOwnedSet: new Set<Cell>() };
        });

        const selected = new StrategyMinimax(randomSource).chooseColor(input);

        expect(selected).toBe("yellow");
        expect(spy).toHaveBeenCalled();
    });
});
