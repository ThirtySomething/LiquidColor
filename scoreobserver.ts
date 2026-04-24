import type { IObserver } from "./iobserver.js";
import type { ObserverData, ScoreData } from "./observerdata.js";

export class ScoreObserver implements IObserver 
{
    update(data: ObserverData): void 
    {
        if (data.type === 'score') 
        {
            const d = data as ScoreData;
            const id = d.player === "Besucher" ? "score_human" : "score_computer";
            const element = document.getElementById(id);
            if (element) 
            {
                element.textContent = String(d.score);
            }
        }
    }
}
