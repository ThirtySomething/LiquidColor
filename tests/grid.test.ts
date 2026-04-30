import { describe, expect, it, vi } from "vitest";

import { Cell } from "../src/cell";
import { Definitions } from "../src/definitions";
import { Grid } from "../src/grid";
import type { Player } from "../src/player";

const getCanvasCtx = (): CanvasRenderingContext2D =>
    ({
        beginPath: vi.fn(),
        rect: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        fillStyle: ""
    }) as unknown as CanvasRenderingContext2D;

describe("Grid", () => {
    it("gridInit creates configured dimensions and assigns colors", () => {
        Definitions.initialize(2, 3, 10);
        const definitions = Definitions.getInstance();
        const grid = new Grid();

        vi.spyOn(Math, "random").mockReturnValue(0);
        grid.gridInit(definitions, getCanvasCtx());

        expect(grid.m_Cells).toHaveLength(3);
        expect(grid.m_Cells[0]).toHaveLength(2);
        expect(grid.m_Cells[0][0].m_Color).toBe(definitions.Colors[0]);
    });

    it("gridReset marks all cells for redraw", () => {
        const grid = new Grid();
        grid.m_Cells = [[new Cell(0, 0), new Cell(1, 0)]];
        grid.m_Cells[0][0].m_DoRedraw = false;
        grid.m_Cells[0][1].m_DoRedraw = false;

        grid.gridReset();

        expect(grid.m_Cells[0][0].m_DoRedraw).toBe(true);
        expect(grid.m_Cells[0][1].m_DoRedraw).toBe(true);
    });

    it("getPlayerCells and identifyBorderCells operate correctly", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const grid = new Grid();
        grid.m_Cells = [
            [new Cell(0, 0), new Cell(1, 0)],
            [new Cell(0, 1), new Cell(1, 1)]
        ];

        grid.m_Cells[0][0].m_Owner = "H";
        grid.m_Cells[0][0].m_Occupied = true;
        grid.m_Cells[1][1].m_Owner = "H";
        grid.m_Cells[1][1].m_Occupied = true;

        const player = { m_PlayerName: "H" } as Player;
        const playerCells = grid.getPlayerCells(player);

        expect(playerCells).toHaveLength(2);

        grid.m_Cells[0][1].m_Occupied = false;
        const border = grid.identifyBorderCells(playerCells, definitions);
        expect(border.length).toBeGreaterThan(0);
    });

    it("playerColorsGet counts only in-bounds and unoccupied neighbor colors", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const grid = new Grid();
        grid.m_Cells = [
            [new Cell(0, 0), new Cell(1, 0)],
            [new Cell(0, 1), new Cell(1, 1)]
        ];

        const source = grid.m_Cells[0][0];
        source.m_Owner = "P";
        source.m_Occupied = true;

        grid.m_Cells[0][1].m_Color = "red";
        grid.m_Cells[0][1].m_Occupied = false;
        grid.m_Cells[1][0].m_Color = "red";
        grid.m_Cells[1][0].m_Occupied = true;
        grid.m_Cells[1][1].m_Color = "blue";
        grid.m_Cells[1][1].m_Occupied = false;

        const colors = grid.playerColorsGet([source], definitions);

        expect(colors.red).toBe(1);
        expect(colors.blue).toBeUndefined();
    });

    it("playerColorsGet tolerates sparse rows and missing neighbors", () => {
        Definitions.initialize(3, 3, 10);
        const definitions = Definitions.getInstance();
        const grid = new Grid();
        grid.m_Cells = [[new Cell(0, 0)], []];

        const source = new Cell(0, 1);
        source.m_Occupied = true;

        expect(() => grid.playerColorsGet([source], definitions)).not.toThrow();
    });

    it("playerColorsGet deduplicates shared unoccupied neighbors", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const grid = new Grid();
        grid.m_Cells = [
            [new Cell(0, 0), new Cell(1, 0)],
            [new Cell(0, 1), new Cell(1, 1)]
        ];

        const topLeft = grid.m_Cells[0][0];
        const bottomLeft = grid.m_Cells[1][0];
        const sharedNeighbour = grid.m_Cells[0][1];

        topLeft.m_Owner = "P";
        topLeft.m_Occupied = true;
        bottomLeft.m_Owner = "P";
        bottomLeft.m_Occupied = true;

        sharedNeighbour.m_Color = "red";
        sharedNeighbour.m_Occupied = false;

        const colors = grid.playerColorsGet([topLeft, bottomLeft], definitions);
        expect(colors.red).toBe(1);
    });
});
