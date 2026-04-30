import type { GamePhaseName } from "./gamephasename.js";

export interface IGamePhase {
    readonly name: GamePhaseName;
    canAcceptMove(): boolean;
    isOver(): boolean;
}
