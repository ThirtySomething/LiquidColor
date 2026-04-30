export class ScoreObserver {
    update(data) {
        if (data.type === 'score') {
            const d = data;
            const id = d.player === "Besucher" ? "score_human" : "score_computer";
            const element = document.getElementById(id);
            if (element) {
                element.textContent = String(d.score);
            }
        }
    }
}
//# sourceMappingURL=scoreobserver.js.map