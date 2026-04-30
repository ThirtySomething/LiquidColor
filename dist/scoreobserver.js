export class ScoreObserver {
    update(data) {
        if (data.type === 'score') {
            const d = data;
            const element = document.getElementById(d.scoreElementId);
            if (element) {
                element.textContent = String(d.score);
            }
        }
    }
}
