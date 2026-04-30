import { vi } from "vitest";

export const createMockCanvasContext = (): CanvasRenderingContext2D =>
    ({
        beginPath: vi.fn(),
        rect: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        fillStyle: ""
    }) as unknown as CanvasRenderingContext2D;

export const setTestDom = (html: string): void => {
    document.body.innerHTML = html;
};

export const mockCanvasElementContext = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D | null = createMockCanvasContext()
): void => {
    (canvas as unknown as { getContext: () => CanvasRenderingContext2D | null }).getContext = () => context;
};
