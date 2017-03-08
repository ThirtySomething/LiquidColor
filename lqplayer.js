"use strict";

function LQPlayer(PlayerName) {
    // ------------------------------------------------------------
    // Player data
    this.Config = {};
    this.Config.PlayerName = PlayerName;
    // ------------------------------------------------------------
    this.CounterUpdate = function (BoardData) {
        var CellCounter = 0;
        if ((BoardData.hasOwnProperty("DimensionX")) &&
            (BoardData.hasOwnProperty("DimensionY")) &&
            (BoardData.hasOwnProperty("Cells")) &&
            (Array.isArray(BoardData.Cells))) {
            var MaxLoop = BoardData.DimensionX * BoardData.DimensionY;
            for (var Loop = 0; Loop < MaxLoop; Loop++) {
                if ((typeof BoardData.Cells[Loop].IsOccupied === "function") &&
                    (typeof BoardData.Cells[Loop].OwnerGet === "function")) {
                    if ((true === BoardData.Cells[Loop].IsOccupied()) &&
                        (this.Config.PlayerName === BoardData.Cells[Loop].OwnerGet())) {
                        CellCounter++;
                    }
                } else {
                    console.log("No cell object for index[" + Loop + "]");
                }
            }
        } else {
            console.log("No board config data object passed!");
        }
        $("#" + this.Config.PlayerName).html(CellCounter);
    };
}