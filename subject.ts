import type { IObserver } from "./iobserver.js";
import type { ObserverData } from "./observerdata.js";

export class Subject 
{
    private observers: IObserver[] = [];

    attach(observer: IObserver): void 
    {
        this.observers.push(observer);
    }

    detach(observer: IObserver): void 
    {
        this.observers = this.observers.filter(o => o !== observer);
    }

    notify(data: ObserverData): void 
    {
        this.observers.forEach(observer => observer.update(data));
    }
}
