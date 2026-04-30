import { vi } from "vitest";

export const createMockCanvasContext = (): CanvasRenderingContext2D =>
    ({
        beginPath: vi.fn(),
        rect: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        fillStyle: ""
    }) as unknown as CanvasRenderingContext2D;
