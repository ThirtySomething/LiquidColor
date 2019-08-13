function LCPlayer(PlayerName, IDName, IDScore) {
    "use strict";
    // ------------------------------------------------------------
    this.m_PlayerName = PlayerName;
    this.m_BaseCell = null;
    this.m_Offsets = [];
    this.m_IDName = IDName;
    this.m_IDScore = IDScore;
    // ------------------------------------------------------------
    this.CounterUpdate = function(Cells, Definitions) {
        var CellCounter = 0;
        var CurrentPlayer = this;

        Cells.forEach(function(CurrentRow) {
            CurrentRow.forEach(function(CurrentCell) {
                if (
                    true === CurrentCell.m_Occupied &&
                    CurrentPlayer.m_PlayerName === CurrentCell.m_Owner
                ) {
                    CellCounter += 1;
                }
            });
        });

        $("#" + this.m_IDScore).html(CellCounter);
        if (CellCounter >= Definitions.Winner) {
            $("#" + this.m_IDWinner).html(
                "Player [" +
                this.m_PlayerName +
                "] won the game - has more than the half cells occupied."
            );
            $("#" + this.m_IDWinner).removeClass("dspno");
        }
    };
    // ------------------------------------------------------------
    this.Init = function(Board, PosX, PosY, IDWinner) {
        $("#" + this.m_IDName).html(this.m_PlayerName);
        this.m_IDWinner = IDWinner;
        this.m_BaseCell = Board.m_Grid.m_Cells[PosY][PosX];
        this.m_BaseCell.OwnerSet(this.m_PlayerName);
        this.m_BaseCell.Draw(Board.m_Definitions, Board.m_CanvasElement);
        this.CellsMarkOwner(
            Board.m_Grid.m_Cells,
            Board.m_Definitions,
            Board.m_CanvasElement
        );
    };
    // ------------------------------------------------------------
    this.Move = function(Cells, Colors, Definitions, CanvasElement) {
        this.m_BaseCell.m_Color = this.m_BaseCell.CellColorRandomGet(Colors);
        this.m_BaseCell.Draw(Definitions, CanvasElement);
        this.CellsMarkOwner(Cells, Definitions, CanvasElement);
    };
    // ------------------------------------------------------------
    this.CellsMarkOwner = function(Cells, Definitions, CanvasElement) {
        var CellsCollect = [];
        var Player = this;
        var CellsWork = Player.m_BaseCell.NeighboursGet(Cells, Definitions);
        http:
            do {
                CellsWork.forEach(function(CurrentCell) {
                    CurrentCell.m_Color = Player.m_BaseCell.m_Color;
                    CurrentCell.OwnerSet(Player.m_PlayerName);
                    CurrentCell.Draw(Definitions, CanvasElement);
                    var NewNeighbours = CurrentCell.NeighboursGet(Cells, Definitions);
                    NewNeighbours.forEach(function(NewCell) {
                        CellsCollect.push(NewCell);
                    });
                });
                CellsWork = CellsCollect.filter(function(value, index, self) {
                    return self.indexOf(value) === index;
                });
                CellsCollect = [];
            } while (0 < CellsWork.length);

        this.CounterUpdate(Cells, Definitions);
    };
    // ------------------------------------------------------------
    this.IdentifyBestColor = function(ColorInformation, NewColorPlayer) {
        var BestColor = this.m_BaseCell.m_Color;
        var Number = -1;
        var Player = this;

        for (var Color in ColorInformation) {
            if (Color === NewColorPlayer) {
                continue;
            }
            if (Color === Player.m_BaseCell.m_Color) {
                continue;
            }
            if (Number < ColorInformation[Color]) {
                Number = ColorInformation[Color];
                BestColor = Color;
            }
        }

        return BestColor;
    };
}