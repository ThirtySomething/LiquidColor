import type { TimerRuntime } from "./types/timerruntime.js";
import { Util } from "./util.js";

export type { TimerRuntime } from "./types/timerruntime.js";

export const BrowserTimerRuntime: TimerRuntime = {
    now(): number {
        return Date.now();
    },
    setInterval(callback: () => void, delayMs: number): number {
        return window.setInterval(callback, delayMs);
    },
    clearInterval(intervalId: number): void {
        window.clearInterval(intervalId);
    }
};

export class Timer {
    m_IDDuration: string;
    m_StartTimestamp: number | null;
    m_Ticker: number | null;
    m_Runtime: TimerRuntime;

    constructor(idDuration: string, runtime: TimerRuntime = BrowserTimerRuntime) {
        this.m_IDDuration = idDuration;
        this.m_StartTimestamp = null;
        this.m_Ticker = null;
        this.m_Runtime = runtime;
    }

    formatDuration(ms: number): string {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    updateDisplay(): void {
        const elapsedMs = this.m_StartTimestamp === null
            ? 0
            : this.m_Runtime.now() - this.m_StartTimestamp;
        Util.setText(this.m_IDDuration, `Duration: ${this.formatDuration(elapsedMs)}`);
    }

    startTicker(): void {
        if (this.m_Ticker !== null) {
            this.m_Runtime.clearInterval(this.m_Ticker);
        }

        this.m_Ticker = this.m_Runtime.setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    reset(): void {
        if (this.m_Ticker !== null) {
            this.m_Runtime.clearInterval(this.m_Ticker);
            this.m_Ticker = null;
        }

        this.m_StartTimestamp = null;
        this.updateDisplay();
    }

    startCounting(): void {
        if (this.m_StartTimestamp !== null) {
            return;
        }

        this.m_StartTimestamp = this.m_Runtime.now();
        this.updateDisplay();
    }

    stop(): void {
        if (this.m_Ticker !== null) {
            this.m_Runtime.clearInterval(this.m_Ticker);
            this.m_Ticker = null;
        }

        this.updateDisplay();
    }
}
