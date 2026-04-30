import { describe, expect, it } from "vitest";

import { Cell } from "../cell";
import { Definitions } from "../definitions";
import type { RandomSource } from "../randomsource";
import { ComputerStrategyFactory } from "../strategies/computerstrategyfactory";
import { StrategyGreedy } from "../strategies/strategygreedy";
import type { StrategyInput } from "../strategies/strategyinput";
import { StrategyMinimax } from "../strategies/strategyminimax";

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
});
