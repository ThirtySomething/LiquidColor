"use strict";

function LCPlayer(PlayerName) {
    // ------------------------------------------------------------
    // Player data
    this.m_PlayerName = PlayerName;
    this.m_BaseCell = null;
    this.m_Offsets = [];
    // ------------------------------------------------------------
    this.CounterUpdate = function (Board) {
        var CellCounter = 0;
        var CurrentPlayer = this;

        Board.m_Cells.forEach(function (CurrentRow) {
            CurrentRow.forEach(function (CurrentCell) {
                if ((true === CurrentCell.m_Occupied) &&
                    (CurrentPlayer.m_PlayerName === CurrentCell.m_Owner)) {
                    CellCounter++;
                }
            });
        });

        $("#" + this.m_PlayerName).html(CellCounter);
    };
}