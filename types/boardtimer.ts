export interface BoardTimer {
    reset(): void;
    startTicker(): void;
    startCounting(): void;
    stop(): void;
}
