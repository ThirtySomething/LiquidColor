import type { ObserverData } from "./observerdata.js";

export interface IObserver {
    update(data: ObserverData): void;
}
