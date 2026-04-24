export interface ScoreData {
    type: 'score';
    player: string;
    score: number;
}

export interface WinnerData {
    type: 'winner';
    player: string;
}

export type ObserverData = ScoreData | WinnerData;
