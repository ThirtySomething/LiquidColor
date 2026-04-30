import { createApp } from "vue/dist/vue.esm-bundler.js";
import packageInfo from "../package.json";
import { Board } from "./board.js";
import { createBoardDependencies } from "./boarddependencies.js";
import { CommandResetGame } from "./commands/commandresetgame.js";
import { Definitions } from "./definitions.js";
import { Player } from "./player.js";
import { ScoreObserver } from "./scoreobserver.js";
import type { LiquidColorAppBindings } from "./types/liquidcolorappbindings.js";
import type { LiquidColorAppOptions } from "./types/liquidcolorappoptions.js";
import { WinnerObserver } from "./winnerobserver.js";

function createBoardBindings(board: Board): LiquidColorAppBindings {
    const commandInvoker = board.getCommandInvoker();

    return {
        resetGame(): void {
            commandInvoker.clearHistory();
            const command = new CommandResetGame(
                board,
                "dimx",
                "dimy",
                "cellsize",
                "playername",
                "computerstrategy"
            );
            commandInvoker.execute(command, false);
        },
        undoMove(): void {
            commandInvoker.undo();
        },
        redoMove(): void {
            commandInvoker.redo();
        }
    };
}

export function createLiquidColorAppConfig(
    board: Board,
    appVersion: string,
    options: LiquidColorAppOptions = {}
): {
    methods?: LiquidColorAppBindings;
    setup?: () => LiquidColorAppBindings;
    mounted: () => void;
    template: string;
} {
    const bindings = createBoardBindings(board);
    const appConfig = {
        mounted(): void {
            board.init("gamearea", "playbuttons", "winner");
        },
        template: `
        <div class="liquidcolor-root">
            <main class="app-shell">
                <h1 class="title">Liquid Color <span class="title-version">(${appVersion})</span></h1>

                <section id="gameinfo" class="gameinfo" aria-label="Game instructions">
                    This is Liquid Color, a simple strategy game. The goal is to occupy as many cells as possible in one
                    contiguous color. You can select one color from surrounding cells, but not your own current color and
                    not your opponent's current color. The computer starts in the upper-right corner, and the human player
                    starts in the lower-left corner.
                </section>

                <section id="setup" class="setup" aria-label="Game setup">
                    <div class="form-row-group">
                        <div class="form-row">
                            <label for="dimx">Dimension X</label>
                            <input type="number" id="dimx" name="dimx" value="60" min="2" step="1" inputmode="numeric">
                        </div>
                        <div class="form-row">
                            <label for="dimy">Dimension Y</label>
                            <input type="number" id="dimy" name="dimy" value="40" min="2" step="1" inputmode="numeric">
                        </div>
                        <div class="form-row">
                            <label for="cellsize">Cell width</label>
                            <input type="number" id="cellsize" name="cellsize" value="10" min="2" step="1" inputmode="numeric">
                        </div>
                    </div>
                    <div class="form-row-group">
                        <div class="form-row">
                            <label for="playername">Player name</label>
                            <input type="text" id="playername" name="playername" value="ThirtySomething" autocomplete="nickname">
                        </div>
                        <div class="form-row">
                            <label for="computerstrategy">Computer strategy</label>
                            <select id="computerstrategy" name="computerstrategy">
                                <option value="minimax" selected>Minimax (2-ply)</option>
                                <option value="greedy">Greedy (max immediate gain)</option>
                            </select>
                        </div>
                        <div class="actions">
                            <button id="btn_reset" type="button" @click="resetGame">Reset</button>
                            <button id="btn_undo" type="button" @click="undoMove">Undo</button>
                            <button id="btn_redo" type="button" @click="redoMove">Redo</button>
                        </div>
                    </div>
                </section>

                <section id="playground" class="playground" aria-label="Game board">
                    <div class="board-wrap">
                        <canvas id="gamearea" aria-label="Liquid Color game board"></canvas>
                        <div class="gamestatus score-row" v-once>
                            <div class="score-box">
                                <span id="name_human">Human</span>
                                <span id="score_human">0</span>
                            </div>
                            <div class="score-box">
                                <span id="name_computer">Computer</span>
                                <span id="score_computer">0</span>
                            </div>
                        </div>
                    </div>

                    <div id="playbuttons" class="button-column" aria-label="Color selection buttons"></div>
                </section>

                <section class="highscore-panel" aria-label="Highscore board" v-once>
                    <h2 class="highscore-title">Highscores</h2>
                    <div class="highscore-row">
                        <span id="highscore_name_human">Human</span>
                        <span id="highscore_human">0</span>
                    </div>
                    <div class="highscore-row">
                        <span id="highscore_name_computer">Computer</span>
                        <span id="highscore_computer">0</span>
                    </div>
                    <div class="highscore-row">
                        <span>Draws</span>
                        <span id="highscore_draws">0</span>
                    </div>
                    <div class="highscore-row highscore-total">
                        <span>Total games</span>
                        <span id="highscore_total">0</span>
                    </div>
                </section>

                <section class="messages" aria-live="polite" v-once>
                    <p id="moveinfo" class="gamestatus dspno"></p>
                    <p id="gameduration" class="gamestatus">Duration: 00:00</p>
                    <p id="winner" class="gamestatus dspno"></p>
                </section>
            </main>
        </div>
    `
    };

    if (options.useSetupComposition) {
        return {
            ...appConfig,
            setup: () => bindings
        };
    }

    return {
        ...appConfig,
        methods: bindings
    };
}

Definitions.initialize(30, 20, 15);
const definitions = Definitions.getInstance();
const human = new Player("Besucher", "name_human", "score_human", () => { });
const computer = new Player("DerPaul", "name_computer", "score_computer", () => { });
const boardDependencies = createBoardDependencies();
Board.initialize(definitions, human, computer, boardDependencies);

const board = Board.getInstance();
const appVersion = packageInfo.version;
const uiSubject = board.getUISubject();
human.setNotifyUI(uiSubject.notify.bind(uiSubject));
computer.setNotifyUI(uiSubject.notify.bind(uiSubject));

uiSubject.attach(new ScoreObserver());
uiSubject.attach(new WinnerObserver());

createApp(createLiquidColorAppConfig(board, appVersion)).mount("#liquidcolor");
