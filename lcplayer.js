"use strict";

function LCPlayer(PlayerName) {
    // ------------------------------------------------------------
    // Player data
    this.m_PlayerName = PlayerName;
    this.m_BaseCell = null;
    // ------------------------------------------------------------
    this.CounterUpdate = function (Board) {
        var CellCounter = 0;

        for (var LoopY = 0; LoopY < Board.m_Definitions.DimensionY; LoopY++) {
            for (var LoopX = 0; LoopX < Board.m_Definitions.DimensionX; LoopX++) {
                if ((true === Board.m_Cells[LoopY][LoopX].m_Occupied) &&
                    (this.m_PlayerName === Board.m_Cells[LoopY][LoopX].m_Owner)) {
                    CellCounter++;
                }
            }
        }

        $("#" + this.m_PlayerName).html(CellCounter);
    };
}