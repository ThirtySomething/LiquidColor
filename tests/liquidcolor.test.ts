import { beforeEach, describe, expect, it, vi } from "vitest";

const createAppMock = vi.fn();
const mountMock = vi.fn();

const attachMock = vi.fn();
const notifyMock = vi.fn();
const clearHistoryMock = vi.fn();
const undoMock = vi.fn();
const redoMock = vi.fn();
const executeMock = vi.fn();
const initMock = vi.fn();

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
    ) { }
}

vi.mock("vue/dist/vue.esm-bundler.js", () => ({
    createApp: createAppMock
}));

vi.mock("../board", () => ({
    Board: boardStatic
}));

vi.mock("../definitions", () => ({
    Definitions: definitionsStatic
}));

vi.mock("../player", () => ({
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

        createAppMock.mockReturnValue({ mount: mountMock });
    });

    it("wires board, observers and vue app methods", async () => {
        await import("../liquidcolor");

        expect(definitionsStatic.initialize).toHaveBeenCalled();
        expect(boardStatic.initialize).toHaveBeenCalled();
        expect(attachMock).toHaveBeenCalledTimes(2);
        expect(createAppMock).toHaveBeenCalledTimes(1);
        expect(mountMock).toHaveBeenCalledWith("#liquidcolor");

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
        expect(executeMock).toHaveBeenCalled();
        expect(undoMock).toHaveBeenCalled();
        expect(redoMock).toHaveBeenCalled();
        expect(initMock).toHaveBeenCalledWith("gamearea", "playbuttons", "winner");
    });
});
