"use strict";

function LCPlayer(PlayerName) {
    // ------------------------------------------------------------
    // Player data
    this.m_PlayerName = PlayerName;
    this.m_BaseCell = null;
    this.m_Offsets = [];
    // ------------------------------------------------------------
    this.CounterUpdate = function (Cells) {
        var CellCounter = 0;
        var CurrentPlayer = this;

        Cells.forEach(function (CurrentRow) {
            CurrentRow.forEach(function (CurrentCell) {
                if ((true === CurrentCell.m_Occupied) &&
                    (CurrentPlayer.m_PlayerName === CurrentCell.m_Owner)) {
                    CellCounter++;
                }
            });
        });

        $("#" + this.m_PlayerName).html(CellCounter);
    };
    // ------------------------------------------------------------
    this.Init = function (Board, PosX, PosY, Colors) {
        this.m_BaseCell = Board.m_Cells[PosY][PosX];
        this.m_BaseCell.OwnerSet(this.m_PlayerName);
        this.CellsMarkOwner(Board.m_Cells, Board.m_Definitions, Board.m_CanvasElement);

    };
    // ------------------------------------------------------------
    this.Move = function (Cells, Colors, Definitions, CanvasElement) {
        this.m_BaseCell.CellColorRandomSet(Colors);
        this.m_BaseCell.Draw(Definitions, CanvasElement);
        this.CellsMarkOwner(Cells, Definitions, CanvasElement);
    };
    // ------------------------------------------------------------
    this.CellsMarkOwner = function (Cells, Definitions, CanvasElement) {
        var CellsCollect = [];
        var Player = this;
        var CellsWork = Player.m_BaseCell.NeighboursGet(Cells, Definitions);

        do {
            CellsWork.forEach(function (CurrentCell) {
                CurrentCell.m_Color = Player.m_BaseCell.m_Color;
                CurrentCell.OwnerSet(Player.m_PlayerName);
                CurrentCell.Draw(Definitions, CanvasElement);
                var NewNeighbours = CurrentCell.NeighboursGet(Cells, Definitions);
                NewNeighbours.forEach(function (NewCell) {
                    CellsCollect.push(NewCell)
                });

            });
            CellsWork = CellsCollect;
            CellsCollect = [];
        } while (0 < CellsWork.length);

        this.CounterUpdate(Cells);
    };
}