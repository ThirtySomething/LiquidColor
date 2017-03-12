"use strict";

function LCBoard(Definitions, PlayerHuman, PlayerComputer) {
    // ------------------------------------------------------------
    // Board config
    this.m_Cells = [];
    this.m_CanvasElement = null;
    this.m_Definitions = Definitions;
    this.m_PlayerHuman = PlayerHuman;
    this.m_PlayerComputer = PlayerComputer;
    // ------------------------------------------------------------
    this.Init = function (GameField, ButtonField) {
        var BoardWidth = this.m_Definitions.DimensionX * this.m_Definitions.CellSize;
        var BoardHeight = this.m_Definitions.DimensionY * this.m_Definitions.CellSize;

        ElementSetSize($("#" + GameField), BoardWidth, BoardHeight);
        $("#" + GameField).css("border", "1px solid black");

        var Graphics = document.getElementById(GameField);
        if (Graphics.getContext) {
            this.m_CanvasElement = Graphics.getContext("2d");
            this.BoardInit();
            this.BoardButtonsInit(ButtonField);
            this.PlayerInit();
        }
    };
    // ------------------------------------------------------------
    this.PlayerInit = function () {
        // Human
        this.m_PlayerHuman.m_BaseCell = this.m_Cells[this.m_Definitions.DimensionY - 1][0];
        this.m_PlayerHuman.m_BaseCell.OwnerSet(this.m_PlayerHuman.m_PlayerName);
        this.m_PlayerHuman.m_BaseCell.CellColorRandomSet(this.m_Definitions.Colors);
        this.m_PlayerHuman.m_BaseCell.Draw(this);
        this.CellMarkOwner(this.m_PlayerHuman);

        // Computer
        var colors = this.m_Definitions.Colors.filter(color => color !== this.m_PlayerHuman.m_BaseCell.m_Color);
        this.m_PlayerComputer.m_BaseCell = this.m_Cells[0][this.m_Definitions.DimensionX - 1];
        this.m_PlayerComputer.m_BaseCell.OwnerSet(this.m_PlayerComputer.m_PlayerName);
        this.m_PlayerComputer.m_BaseCell.Draw(this);
        this.CellMarkOwner(this.m_PlayerComputer);
    };
    // ------------------------------------------------------------
    this.BoardInit = function () {
        this.m_Cells = [];

        for (var LoopY = 0; LoopY < this.m_Definitions.DimensionY; LoopY++) {
            this.m_Cells[LoopY] = [];
            for (var LoopX = 0; LoopX < this.m_Definitions.DimensionX; LoopX++) {
                var PosX = LoopX * this.m_Definitions.CellSize;
                var PosY = LoopY * this.m_Definitions.CellSize;
                var CurrentCell = new LCCell(LoopX, LoopY, this.m_Definitions.Colors);
                CurrentCell.CellColorRandomSet(this.m_Definitions.Colors);
                CurrentCell.Draw(this);
                this.m_Cells[LoopY].push(CurrentCell);
            }
        }
    };
    // ------------------------------------------------------------
    this.BoardButtonsInit = function (ButtonField) {
        // Retrive margin size from CSS classn
        var BtnMargin = parseInt($("#fakebtn").css("margin"));
        var NumberOfButtons = this.m_Definitions.Colors.length;
        var BtnWidth = parseInt(Math.floor((this.m_Definitions.DimensionX * this.m_Definitions.CellSize) / 5));
        var BtnHeight = parseInt(Math.floor(((this.m_Definitions.DimensionY * this.m_Definitions.CellSize) - ((NumberOfButtons + 1) * BtnMargin)) / NumberOfButtons));
        var GameBoard = this;
        $("#fakebtn").hide();

        for (var Loop = 0; Loop < NumberOfButtons; Loop++) {
            var CurCol = this.m_Definitions.Colors[Loop];
            var Button = $("#" + ButtonField).append("<div id=\"" + CurCol + "\"></div>");

            ElementSetSize($("#" + CurCol), BtnWidth, BtnHeight);
            $("#" + CurCol).css("background-color", CurCol);
            $("#" + CurCol).addClass("gamebtn");
            $("#" + CurCol).unbind("click").bind("click", {
                Board: this,
                Color: CurCol
            }, function (event) {
                event.data.Board.PerformMove(event.data.Color);
            });
        }
    };
    // ------------------------------------------------------------
    this.CellMarkOwner = function (Player) {
        var CellsCollect = [];
        var CellsWork = Player.m_BaseCell.NeighboursGet(this.m_Cells, this.m_Definitions.Offsets);
        var Board = this;

        do {
            CellsWork.forEach(function (CurrentCell) {
                CurrentCell.m_Color = Player.m_BaseCell.m_Color;
                CurrentCell.OwnerSet(Player.m_PlayerName);
                CurrentCell.Draw(Board);
                CurrentCell.m_Neighbourcheck = true;
                var NewNeighbours = CurrentCell.NeighboursGet(Board.m_Cells, Board.m_Definitions.Offsets);
                NewNeighbours.forEach(function (NewCell) {
                    CellsCollect.push(NewCell)
                });

            });
            CellsWork = CellsCollect;
            CellsCollect = [];
        } while (0 < CellsWork.length);

        Player.CounterUpdate(this);
    };
    // ------------------------------------------------------------
    this.PerformMove = function (NewColor) {
        // Checks
        if (NewColor === this.m_PlayerHuman.m_BaseCell.m_Color) {
            alert("You cannot select the color of yourself.");
            return;
        }
        if (NewColor === this.m_PlayerComputer.m_BaseCell.m_Color) {
            alert("You cannot select the color of your opponent.");
            return;
        }

        // Human
        this.m_PlayerHuman.m_BaseCell.m_Color = NewColor;
        this.m_PlayerHuman.m_BaseCell.Draw(this);
        this.CellMarkOwner(this.m_PlayerHuman);

        // Computer
        var colors = this.m_Definitions.Colors.filter(color => color !== NewColor);
        colors = colors.filter(color => color !== this.m_PlayerComputer.m_BaseCell.m_Color);
        this.m_PlayerComputer.m_BaseCell.CellColorRandomSet(colors);
        this.m_PlayerComputer.m_BaseCell.Draw(this);
        this.CellMarkOwner(this.m_PlayerComputer);
    };
}