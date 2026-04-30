import { beforeEach, describe, expect, it, vi } from "vitest";

const createAppMock = vi.fn();
const mountMock = vi.fn();
const commandResetGameMock = vi.fn();

const attachMock = vi.fn();
const notifyMock = vi.fn();
const clearHistoryMock = vi.fn();
const undoMock = vi.fn();
const redoMock = vi.fn();
const executeMock = vi.fn();
const initMock = vi.fn();
const playerInstances: PlayerMock[] = [];

const subject = {
    attach: attachMock,
    notify: notifyMock
};

const invoker = {
    clearHistory: clearHistoryMock,
    undo: undoMock,
    redo: redoMock,
    execute: executeMock
};

const boardInstance = {
    getUISubject: () => subject,
    getCommandInvoker: () => invoker,
    init: initMock
};

const boardStatic = {
    initialize: vi.fn(),
    getInstance: vi.fn(() => boardInstance)
};

const definitionsStatic = {
    initialize: vi.fn(),
    getInstance: vi.fn(() => ({ DimensionX: 2, DimensionY: 2, CellSize: 10, Colors: ["red"] }))
};

class PlayerMock {
    setNotifyUI = vi.fn();
    constructor(
        public m_PlayerName: string,
        public m_IDName: string,
        public m_IDScore: string,
        public m_NotifyUI: () => void
    ) {
        playerInstances.push(this);
    }
}

vi.mock("vue/dist/vue.esm-bundler.js", () => ({
    createApp: createAppMock
}));

vi.mock("../src/board", () => ({
    Board: boardStatic
}));

vi.mock("../src/commands/commandresetgame", () => ({
    CommandResetGame: commandResetGameMock
}));

vi.mock("../src/definitions", () => ({
    Definitions: definitionsStatic
}));

vi.mock("../src/player", () => ({
    Player: PlayerMock
}));

describe("liquidcolor bootstrap", () => {
    beforeEach(() => {
        vi.resetModules();
        createAppMock.mockReset();
        mountMock.mockReset();
        attachMock.mockReset();
        notifyMock.mockReset();
        clearHistoryMock.mockReset();
        undoMock.mockReset();
        redoMock.mockReset();
        executeMock.mockReset();
        initMock.mockReset();
        commandResetGameMock.mockReset();
        playerInstances.length = 0;

        createAppMock.mockReturnValue({ mount: mountMock });
    });

    it("wires board, observers and vue app methods", async () => {
        const module = await import("../src/liquidcolor");

        expect(definitionsStatic.initialize).toHaveBeenCalled();
        expect(boardStatic.initialize).toHaveBeenCalled();
        expect(attachMock).toHaveBeenCalledTimes(2);
        expect(createAppMock).toHaveBeenCalledTimes(1);
        expect(mountMock).toHaveBeenCalledWith("#liquidcolor");
        expect(playerInstances).toHaveLength(2);

        const [human, computer] = playerInstances;
        expect(human?.setNotifyUI).toHaveBeenCalledTimes(1);
        expect(computer?.setNotifyUI).toHaveBeenCalledTimes(1);

        const humanNotify = human?.setNotifyUI.mock.calls[0]?.[0] as (() => void) | undefined;
        const computerNotify = computer?.setNotifyUI.mock.calls[0]?.[0] as (() => void) | undefined;

        humanNotify?.();
        computerNotify?.();

        expect(notifyMock).toHaveBeenCalledTimes(2);

        const appConfig = createAppMock.mock.calls[0][0] as {
            methods: {
                resetGame: () => void;
                undoMove: () => void;
                redoMove: () => void;
            };
            mounted: () => void;
        };

        appConfig.methods.resetGame();
        appConfig.methods.undoMove();
        appConfig.methods.redoMove();
        appConfig.mounted();

        expect(clearHistoryMock).toHaveBeenCalled();
        expect(commandResetGameMock).toHaveBeenCalledWith(
            boardInstance,
            "dimx",
            "dimy",
            "cellsize",
            "playername",
            "computerstrategy"
        );
        expect(executeMock).toHaveBeenCalled();
        expect(executeMock).toHaveBeenCalledWith(commandResetGameMock.mock.results[0]?.value, false);
        expect(undoMock).toHaveBeenCalled();
        expect(redoMock).toHaveBeenCalled();
        expect(initMock).toHaveBeenCalledWith("gamearea", "playbuttons", "winner");

        const setupConfig = module.createLiquidColorAppConfig(boardInstance as never, "1.2.3", {
            useSetupComposition: true
        });

        expect(setupConfig.methods).toBeUndefined();
        expect(setupConfig.setup).toBeTypeOf("function");

        const bindings = setupConfig.setup?.();
        expect(bindings).toMatchObject({
            resetGame: expect.any(Function),
            undoMove: expect.any(Function),
            redoMove: expect.any(Function)
        });
        bindings?.resetGame();
        bindings?.undoMove();
        bindings?.redoMove();
        setupConfig.mounted();

        expect(clearHistoryMock).toHaveBeenCalledTimes(2);
        expect(executeMock).toHaveBeenCalledTimes(2);
        expect(undoMock).toHaveBeenCalledTimes(2);
        expect(redoMock).toHaveBeenCalledTimes(2);
        expect(initMock).toHaveBeenCalledTimes(2);
    });
});
