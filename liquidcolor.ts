import { Board } from "./board.js";
import { Definitions } from "./definitions.js";
import { Player } from "./player.js";

const definitions = new Definitions(30, 20, 15);
const human = new Player("Besucher", "name_human", "score_human");
const computer = new Player("DerPaul", "name_computer", "score_computer");
const board = new Board(definitions, human, computer);

function initLiquidColor(): void {
    const compare = document.getElementById("compare");
    if (compare) {
        compare.style.display = "none";
    }

    board.init("gamearea", "playbuttons", "winner");

    const resetButton = document.getElementById("btn_reset");
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            board.reInit("dimx", "dimy", "cellsize", "playername", "computerstrategy");
        });
    }
}

document.addEventListener("DOMContentLoaded", initLiquidColor);
