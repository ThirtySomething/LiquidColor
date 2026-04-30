import { describe, expect, it, vi } from "vitest";

import type { Board } from "../src/board";
import { Cell } from "../src/cell";
import { Definitions } from "../src/definitions";
import { Player } from "../src/player";

const getCanvasCtx = (): CanvasRenderingContext2D =>
    ({
        beginPath: vi.fn(),
        rect: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        fillStyle: ""
    }) as unknown as CanvasRenderingContext2D;

const buildCells = (): Cell[][] => {
    return [
        [new Cell(0, 0), new Cell(1, 0)],
        [new Cell(0, 1), new Cell(1, 1)]
    ];
};

describe("Player", () => {
    it("setNotifyUI replaces notify callback", () => {
        const first = vi.fn();
        const second = vi.fn();
        const player = new Player("H", "name_h", "score_h", first);

        player.setNotifyUI(second);
        Definitions.initialize(1, 2, 10);
        const definitions = Definitions.getInstance();
        definitions.Winner = 99;
        const cells = [[new Cell(0, 0)], [new Cell(0, 1)]];
        cells[0][0].m_Occupied = true;
        cells[0][0].m_Owner = "H";

        player.counterUpdate(cells, definitions);

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalled();
    });

    it("counterUpdate publishes score and winner when threshold reached", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        definitions.Winner = 2;

        const events: unknown[] = [];
        const player = new Player("H", "name_h", "score_h", (data) => events.push(data));
        const cells = buildCells();
        cells[0][0].m_Owner = "H";
        cells[0][0].m_Occupied = true;
        cells[1][0].m_Owner = "H";
        cells[1][0].m_Occupied = true;

        player.counterUpdate(cells, definitions);

        expect(events).toHaveLength(2);
        expect(events[0]).toMatchObject({ type: "score", score: 2, scoreElementId: "score_h" });
        expect(events[1]).toMatchObject({ type: "winner", player: "H" });
    });

    it("init sets base cell and owner when cell exists", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        document.body.innerHTML = '<div id="name_h"></div>';

        const player = new Player("H", "name_h", "score_h", () => undefined);
        const board = {
            m_Grid: { m_Cells: buildCells() },
            m_Definitions: definitions,
            m_CanvasElement: getCanvasCtx()
        } as unknown as Board;

        player.init(board, 0, 0, "winner");

        expect(player.m_BaseCell).not.toBeNull();
        expect(player.m_BaseCell?.m_Owner).toBe("H");
        expect(document.getElementById("name_h")?.textContent).toBe("H");
    });

    it("init no-ops when target base cell does not exist", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const player = new Player("H", "name_h", "score_h", () => undefined);
        const board = {
            m_Grid: { m_Cells: [[new Cell(0, 0)]] },
            m_Definitions: definitions,
            m_CanvasElement: getCanvasCtx()
        } as unknown as Board;

        player.init(board, 1, 1, "winner");

        expect(player.m_BaseCell).toBeNull();
    });

    it("move exits when base cell or canvas missing", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const player = new Player("H", "name_h", "score_h", () => undefined);
        const cells = buildCells();

        expect(() => player.move(cells, ["red"], definitions, null)).not.toThrow();

        player.m_BaseCell = cells[0][0];
        const markSpy = vi.spyOn(player, "cellsMarkOwner");
        player.move(cells, ["red"], definitions, getCanvasCtx());

        expect(markSpy).toHaveBeenCalled();
    });

    it("move keeps current color when random source returns invalid index inputs", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const player = new Player("H", "name_h", "score_h", () => undefined);
        const cells = buildCells();
        const base = cells[0][0];
        base.m_Color = "fallback";
        player.m_BaseCell = base;

        player.move(cells, ["red", "green"], definitions, getCanvasCtx(), { next: () => Number.NaN });

        expect(base.m_Color).toBe("fallback");
    });

    it("cellsMarkOwner captures neighbors with queued deduplication", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const player = new Player("H", "name_h", "score_h", () => undefined);
        const cells = buildCells();
        const base = cells[0][0];
        base.m_Color = "blue";
        base.m_Occupied = true;
        base.m_Owner = "H";

        cells[0][1].m_Color = "blue";
        cells[1][0].m_Color = "blue";
        cells[1][1].m_Color = "blue";

        player.m_BaseCell = base;
        const counterSpy = vi.spyOn(player, "counterUpdate");

        player.cellsMarkOwner(cells, definitions, getCanvasCtx());

        expect(cells[0][1].m_Owner).toBe("H");
        expect(cells[1][0].m_Owner).toBe("H");
        expect(counterSpy).toHaveBeenCalled();
    });

    it("cellsMarkOwner no-ops without base cell and handles base removal during traversal", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const player = new Player("H", "name_h", "score_h", () => undefined);
        const cells = buildCells();

        expect(() => player.cellsMarkOwner(cells, definitions, getCanvasCtx())).not.toThrow();

        const base = cells[0][0];
        const next = cells[0][1];
        player.m_BaseCell = base;
        base.neighboursGet = vi.fn(() => {
            player.m_BaseCell = null;
            return [next];
        });

        expect(() => player.cellsMarkOwner(cells, definitions, getCanvasCtx())).not.toThrow();
    });

    it("identifyBestColor falls back when base cells are missing", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const player = new Player("CPU", "name_c", "score_c", () => undefined);
        const opponent = new Player("H", "name_h", "score_h", () => undefined);

        expect(player.identifyBestColor([], definitions, "yellow", opponent, "greedy")).toBe("yellow");
    });

    it("identifyBestColor delegates to strategy factory when bases exist", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const player = new Player("CPU", "name_c", "score_c", () => undefined);
        const opponent = new Player("H", "name_h", "score_h", () => undefined);
        const cells = buildCells();

        player.m_BaseCell = cells[0][0];
        opponent.m_BaseCell = cells[1][1];
        player.m_BaseCell.m_Color = "red";
        opponent.m_BaseCell.m_Color = "blue";

        const color = player.identifyBestColor(cells, definitions, "green", opponent, "minimax");
        expect(typeof color).toBe("string");
    });

    it("identifyBestColor tolerates invalid strategy values via fallback factory path", () => {
        Definitions.initialize(2, 2, 10);
        const definitions = Definitions.getInstance();
        const player = new Player("CPU", "name_c", "score_c", () => undefined);
        const opponent = new Player("H", "name_h", "score_h", () => undefined);
        const cells = buildCells();

        player.m_BaseCell = cells[0][0];
        opponent.m_BaseCell = cells[1][1];
        player.m_BaseCell.m_Color = "red";
        opponent.m_BaseCell.m_Color = "blue";

        const color = player.identifyBestColor(
            cells,
            definitions,
            "green",
            opponent,
            "invalid" as unknown as "minimax"
        );

        expect(typeof color).toBe("string");
    });
});
