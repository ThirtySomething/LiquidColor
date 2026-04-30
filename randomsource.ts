export interface RandomSource {
    next(): number;
}

export const MathRandomSource: RandomSource = {
    next(): number {
        return Math.random();
    }
};
