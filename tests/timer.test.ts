import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type TimerRuntime, Timer } from "../timer";

const setupDom = (): void => {
    document.body.innerHTML = '<div id="gameduration"></div>';
};

describe("Timer", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        setupDom();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("formats durations as mm:ss with floor and clamp", () => {
        const timer = new Timer("gameduration");

        expect(timer.formatDuration(0)).toBe("00:00");
        expect(timer.formatDuration(61_999)).toBe("01:01");
        expect(timer.formatDuration(-1000)).toBe("00:00");
    });

    it("startCounting initializes timestamp once and updates display", () => {
        const timer = new Timer("gameduration");
        const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1000);

        timer.startCounting();
        expect(document.getElementById("gameduration")?.textContent).toBe("Duration: 00:00");

        nowSpy.mockReturnValue(5000);
        timer.startCounting();
        expect(timer.m_StartTimestamp).toBe(1000);
    });

    it("startTicker ticks every second and reset clears interval", () => {
        const timer = new Timer("gameduration");
        const nowSpy = vi.spyOn(Date, "now");
        nowSpy.mockReturnValue(10_000);

        timer.startCounting();
        timer.startTicker();
        const clearSpy = vi.spyOn(window, "clearInterval");
        timer.startTicker();
        nowSpy.mockReturnValue(12_000);
        vi.advanceTimersByTime(1000);

        expect(document.getElementById("gameduration")?.textContent).toBe("Duration: 00:02");

        timer.reset();

        expect(timer.m_Ticker).toBeNull();
        expect(timer.m_StartTimestamp).toBeNull();
        expect(clearSpy).toHaveBeenCalled();
        expect(document.getElementById("gameduration")?.textContent).toBe("Duration: 00:00");
    });

    it("stop clears interval and keeps latest display", () => {
        const timer = new Timer("gameduration");
        const clearSpy = vi.spyOn(window, "clearInterval");

        vi.spyOn(Date, "now").mockReturnValue(10_000);
        timer.startCounting();
        timer.startTicker();

        vi.spyOn(Date, "now").mockReturnValue(16_000);
        timer.stop();

        expect(clearSpy).toHaveBeenCalled();
        expect(timer.m_Ticker).toBeNull();
        expect(document.getElementById("gameduration")?.textContent).toBe("Duration: 00:06");
    });

    it("supports injected runtime for deterministic clock and scheduler", () => {
        let now = 1_000;
        let callback: (() => void) | null = null;
        const runtime: TimerRuntime = {
            now: () => now,
            setInterval: (cb) => {
                callback = cb;
                return 77;
            },
            clearInterval: vi.fn()
        };

        const timer = new Timer("gameduration", runtime);
        timer.startCounting();
        timer.startTicker();

        now = 3_000;
        callback?.();

        expect(document.getElementById("gameduration")?.textContent).toBe("Duration: 00:02");
        timer.stop();
        expect(runtime.clearInterval).toHaveBeenCalledWith(77);
    });
});
