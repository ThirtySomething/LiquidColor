import type { HighscoreSnapshot } from "./highscoresnapshot.js";

export interface HighscoreRepository {
    load(): HighscoreSnapshot | null;
    save(snapshot: HighscoreSnapshot): void;
}
