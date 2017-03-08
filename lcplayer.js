"use strict";

function LCPlayer(PlayerName) {
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
            (Array.isArray(BoardData.Cells)) &&
            (Array.isArray(BoardData.Cells[0]))) {
            for (var LoopY = 0; LoopY < BoardData.DimensionY; LoopY++) {
                for (var LoopX = 0; LoopX < BoardData.DimensionX; LoopX++) {
                    if ((typeof BoardData.Cells[LoopY][LoopX].IsOccupied === "function") &&
                        (typeof BoardData.Cells[LoopY][LoopX].OwnerGet === "function")) {
                        if ((true === BoardData.Cells[LoopY][LoopX].IsOccupied()) &&
                            (this.Config.PlayerName === BoardData.Cells[LoopY][LoopX].OwnerGet())) {
                            CellCounter++;
                        }
                    } else {
                        console.log("No cell object for index[" + LoopY + "][" + LoopX + "]");
                    }
                }
            }
        } else {
            console.log("No board config data object passed!");
        }

        $("#" + this.Config.PlayerName).html(CellCounter);
    };
}