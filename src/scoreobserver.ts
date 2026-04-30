import type { IObserver } from "./iobserver.js";
import type { ObserverData, ScoreData } from "./observerdata.js";

export class ScoreObserver implements IObserver {
    update(data: ObserverData): void {
        if (data.type === 'score') {
            const d = data as ScoreData;
            const element = document.getElementById(d.scoreElementId);
            if (element) {
                element.textContent = String(d.score);
            }
        }
    }
}
