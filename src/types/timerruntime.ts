export interface TimerRuntime {
    now(): number;
    setInterval(callback: () => void, delayMs: number): number;
    clearInterval(intervalId: number): void;
}
