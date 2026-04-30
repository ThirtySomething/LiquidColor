import { describe, expect, it } from "vitest";

import { Cell } from "../src/cell";
import { Definitions } from "../src/definitions";
import { CaptureSimulator } from "../src/strategies/capturesimulator";

const buildCells = (dimensionX: number, dimensionY: number, color: string): Cell[][] => {
    const cells: Cell[][] = [];
    for (let y = 0; y < dimensionY; y += 1) {
        const row: Cell[] = [];
        for (let x = 0; x < dimensionX; x += 1) {
            const cell = new Cell(x, y);
            cell.m_Color = color;
            row.push(cell);
        }
        cells.push(row);
    }
    return cells;
};

describe("CaptureSimulator", () => {
    it("captures contiguous unoccupied cells of the requested color", () => {
        Definitions.initialize(3, 3, 10);
        const definitions = Definitions.getInstance();
        const cells = buildCells(3, 3, "green");

        const base = cells[1][1];
        base.m_Occupied = true;

        cells[1][2].m_Color = "red";

        const result = CaptureSimulator.simulate(
            cells,
            definitions,
            new Set([base]),
            new Set<Cell>(),
            "green"
        );

        expect(result.gained).toBe(7);
        expect(result.newOwnedSet.size).toBe(8);
        expect(result.newOwnedSet.has(cells[1][2])).toBe(false);
    });

    it("does not capture cells in extraBlocked set", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const cells = buildCells(2, 2, "blue");

        const base = cells[0][0];
        base.m_Occupied = true;
        const blocked = cells[0][1];

        const result = CaptureSimulator.simulate(
            cells,
            definitions,
            new Set([base]),
            new Set([blocked]),
            "blue"
        );

        expect(result.newOwnedSet.has(blocked)).toBe(false);
        expect(result.gained).toBe(2);
    });
});
