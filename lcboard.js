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
        this.m_PlayerHuman.Init(this, 0, this.m_Definitions.DimensionY - 1, this.m_Definitions.Colors);

        // Computer
        var ComputerColors = this.m_Definitions.Colors.filter(AvailableColor => AvailableColor !== this.m_PlayerHuman.m_BaseCell.m_Color);
        this.m_PlayerComputer.Init(this, this.m_Definitions.DimensionX - 1, 0, ComputerColors);
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
                CurrentCell.Draw(this.m_Definitions, this.m_CanvasElement);
                this.m_Cells[LoopY].push(CurrentCell);
            }
        }
    };
    // ------------------------------------------------------------
    this.BoardButtonsInit = function (ButtonField) {
        // Retrive margin size from CSS classn
        var BtnMargin = parseInt($("#fakebtn").css("marginTop"));
        var NumberOfButtons = this.m_Definitions.Colors.length;
        var BtnWidth = parseInt(Math.floor((this.m_Definitions.DimensionX * this.m_Definitions.CellSize) / 5));
        var BtnHeight = parseInt(Math.floor(((this.m_Definitions.DimensionY * this.m_Definitions.CellSize) - ((NumberOfButtons + 1) * BtnMargin)) / NumberOfButtons));
        var GameBoard = this;

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
    this.PerformMove = function (NewColor) {
        // Checks
        $("#moveinfo").html("");
        if (NewColor === this.m_PlayerHuman.m_BaseCell.m_Color) {
            $("#moveinfo").html("You cannot select the color of yourself.");
            return;
        }
        if (NewColor === this.m_PlayerComputer.m_BaseCell.m_Color) {
            $("#moveinfo").html("You cannot select the color of your opponent.");
            return;
        }

        // Reset neighbourhood information
        this.m_Cells.forEach(function (CurrentRow) {
            CurrentRow.forEach(function (CurrentCell) {
                CurrentCell.m_DoRedraw = true;
            });
        });


        // Human move
        this.m_PlayerHuman.Move(this.m_Cells, [NewColor], this.m_Definitions, this.m_CanvasElement);

        // Computer move
        var ValidColors = this.m_Definitions.Colors.filter(AvailableColor => AvailableColor !== NewColor, AvailableColor => AvailableColor !== this.m_PlayerComputer.m_BaseCell.m_Color);
        this.m_PlayerComputer.Move(this.m_Cells, ValidColors, this.m_Definitions, this.m_CanvasElement);
    };
}