export interface ScoreData {
    type: 'score';
    player: string;
    scoreElementId: string;
    score: number;
}

export interface WinnerData {
    type: 'winner';
    player: string;
}

export type ObserverData = ScoreData | WinnerData;
