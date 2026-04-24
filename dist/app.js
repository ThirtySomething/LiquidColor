import { LCBoard } from "./lcboard.js";
import { LCDefinitions } from "./lcdefinitions.js";
import { LCPlayer } from "./lcplayer.js";
const definitions = new LCDefinitions(30, 20, 10);
const human = new LCPlayer("Besucher", "name_human", "score_human");
const computer = new LCPlayer("DerPaul", "name_computer", "score_computer");
const board = new LCBoard(definitions, human, computer);
function initApp() {
    const compare = document.getElementById("compare");
    if (compare) {
        compare.style.display = "none";
    }
    board.init("gamearea", "playbuttons", "winner");
    const resetButton = document.getElementById("btn_reset");
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            board.reInit("dimx", "dimy", "cellsize", "playername");
        });
    }
}
document.addEventListener("DOMContentLoaded", initApp);
