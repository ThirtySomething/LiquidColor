import { Board } from "./board.js";
import { Definitions } from "./definitions.js";
import { ScoreObserver } from "./scoreobserver.js";
import { WinnerObserver } from "./winnerobserver.js";
import { Player } from "./player.js";

Definitions.initialize(30, 20, 15);
const definitions = Definitions.getInstance();
const human = new Player("Besucher", "name_human", "score_human", () => 
{ });
const computer = new Player("DerPaul", "name_computer", "score_computer", () => 
{ });
Board.initialize(definitions, human, computer);

const board = Board.getInstance();
human.setNotifyUI(board.getUISubject().notify.bind(board.getUISubject()));
computer.setNotifyUI(board.getUISubject().notify.bind(board.getUISubject()));

// Create observers
board.getUISubject().attach(new ScoreObserver());
board.getUISubject().attach(new WinnerObserver());

function initLiquidColor(): void 
{
    const compare = document.getElementById("compare");
    if (compare) 
    {
        compare.style.display = "none";
    }

    Board.getInstance().init("gamearea", "playbuttons", "winner");

    const resetButton = document.getElementById("btn_reset");
    if (resetButton) 
    {
        resetButton.addEventListener("click", () => 
        {
            Board.getInstance().reInit("dimx", "dimy", "cellsize", "playername", "computerstrategy");
        });
    }
}

document.addEventListener("DOMContentLoaded", initLiquidColor);
