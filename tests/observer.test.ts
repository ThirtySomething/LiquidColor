import { describe, expect, it } from "vitest";

import type { IObserver } from "../iobserver";
import type { ObserverData } from "../observerdata";
import { ScoreObserver } from "../scoreobserver";
import { Subject } from "../subject";
import { WinnerObserver } from "../winnerobserver";

describe("Observers and Subject", () => {
    it("subject attaches, notifies and detaches observers", () => {
        const received: ObserverData[] = [];
        const observer: IObserver = {
            update: (data) => received.push(data)
        };

        const subject = new Subject();
        subject.attach(observer);
        subject.notify({ type: "winner", player: "A" });
        subject.detach(observer);
        subject.notify({ type: "winner", player: "B" });

        expect(received).toEqual([{ type: "winner", player: "A" }]);
    });

    it("score observer updates matching score element", () => {
        document.body.innerHTML = '<div id="score"></div>';

        const observer = new ScoreObserver();
        observer.update({ type: "score", player: "P", scoreElementId: "score", score: 7 });

        expect(document.getElementById("score")?.textContent).toBe("7");

        expect(() => {
            observer.update({ type: "score", player: "P", scoreElementId: "missing", score: 9 });
            observer.update({ type: "winner", player: "P" });
        }).not.toThrow();
    });

    it("winner observer sets winner message and removes hidden class", () => {
        document.body.innerHTML = '<p id="winner" class="dspno"></p>';

        const observer = new WinnerObserver();
        observer.update({ type: "winner", player: "Alice" });

        const el = document.getElementById("winner");
        expect(el?.textContent).toContain("Alice");
        expect(el?.classList.contains("dspno")).toBe(false);

        expect(() => observer.update({ type: "score", player: "A", scoreElementId: "x", score: 1 })).not.toThrow();
    });
});
