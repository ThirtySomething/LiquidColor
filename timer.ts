import { Util } from "./util.js";

export class Timer
{
    m_IDDuration: string;
    m_StartTimestamp: number | null;
    m_Ticker: number | null;

    constructor(idDuration: string)
    {
        this.m_IDDuration = idDuration;
        this.m_StartTimestamp = null;
        this.m_Ticker = null;
    }

    formatDuration(ms: number): string
    {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    updateDisplay(): void
    {
        const elapsedMs = this.m_StartTimestamp === null
            ? 0
            : Date.now() - this.m_StartTimestamp;
        Util.setText(this.m_IDDuration, `Duration: ${this.formatDuration(elapsedMs)}`);
    }

    startTicker(): void
    {
        if (this.m_Ticker !== null)
        {
            window.clearInterval(this.m_Ticker);
        }

        this.m_Ticker = window.setInterval(() =>
        {
            this.updateDisplay();
        }, 1000);
    }

    reset(): void
    {
        if (this.m_Ticker !== null)
        {
            window.clearInterval(this.m_Ticker);
            this.m_Ticker = null;
        }

        this.m_StartTimestamp = null;
        this.updateDisplay();
    }

    startCounting(): void
    {
        if (this.m_StartTimestamp !== null)
        {
            return;
        }

        this.m_StartTimestamp = Date.now();
        this.updateDisplay();
    }

    stop(): void
    {
        if (this.m_Ticker !== null)
        {
            window.clearInterval(this.m_Ticker);
            this.m_Ticker = null;
        }

        this.updateDisplay();
    }
}
