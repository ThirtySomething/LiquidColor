import type { IObserver } from "./iobserver.js";
import type { ObserverData, WinnerData } from "./observerdata.js";

export class WinnerObserver implements IObserver
{
    update(data: ObserverData): void
    {
        if (data.type === 'winner')
        {
            const d = data as WinnerData;
            const message = `Player [${d.player}] won the game - has more than the half cells occupied.`;
            const element = document.getElementById("winner");
            if (element)
            {
                element.textContent = message;
                element.classList.remove("dspno");
            }
        }
    }
}
