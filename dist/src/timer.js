import { Util } from "./util.js";
export const BrowserTimerRuntime = {
    now() {
        return Date.now();
    },
    setInterval(callback, delayMs) {
        return window.setInterval(callback, delayMs);
    },
    clearInterval(intervalId) {
        window.clearInterval(intervalId);
    }
};
export class Timer {
    m_IDDuration;
    m_StartTimestamp;
    m_Ticker;
    m_Runtime;
    constructor(idDuration, runtime = BrowserTimerRuntime) {
        this.m_IDDuration = idDuration;
        this.m_StartTimestamp = null;
        this.m_Ticker = null;
        this.m_Runtime = runtime;
    }
    formatDuration(ms) {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    updateDisplay() {
        const elapsedMs = this.m_StartTimestamp === null
            ? 0
            : this.m_Runtime.now() - this.m_StartTimestamp;
        Util.setText(this.m_IDDuration, `Duration: ${this.formatDuration(elapsedMs)}`);
    }
    startTicker() {
        if (this.m_Ticker !== null) {
            this.m_Runtime.clearInterval(this.m_Ticker);
        }
        this.m_Ticker = this.m_Runtime.setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }
    reset() {
        if (this.m_Ticker !== null) {
            this.m_Runtime.clearInterval(this.m_Ticker);
            this.m_Ticker = null;
        }
        this.m_StartTimestamp = null;
        this.updateDisplay();
    }
    startCounting() {
        if (this.m_StartTimestamp !== null) {
            return;
        }
        this.m_StartTimestamp = this.m_Runtime.now();
        this.updateDisplay();
    }
    stop() {
        if (this.m_Ticker !== null) {
            this.m_Runtime.clearInterval(this.m_Ticker);
            this.m_Ticker = null;
        }
        this.updateDisplay();
    }
}
