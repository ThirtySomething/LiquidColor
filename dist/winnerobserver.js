export class WinnerObserver {
    update(data) {
        if (data.type === 'winner') {
            const d = data;
            const message = `Player [${d.player}] won the game - has more than the half cells occupied.`;
            const element = document.getElementById("winner");
            if (element) {
                element.textContent = message;
                element.classList.remove("dspno");
            }
        }
    }
}
//# sourceMappingURL=winnerobserver.js.map