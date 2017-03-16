"use strict";

function LCBoard(Definitions, PlayerHuman, PlayerComputer) {
    // ------------------------------------------------------------
    this.m_CanvasElement = null;
    this.m_Definitions = Definitions;
    this.m_PlayerHuman = PlayerHuman;
    this.m_PlayerComputer = PlayerComputer;
    this.m_Grid = new LCGrid();
    this.m_IDGameField = null;
    this.m_IDButtonField = null;
    this.m_IDWinner = null;
    // ------------------------------------------------------------
    this.Init = function (GameField, ButtonField, IDWinner) {
        this.m_IDGameField = GameField;
        this.m_IDButtonField = ButtonField;
        this.m_IDWinner = IDWinner;
        var Graphics = document.getElementById(this.m_IDGameField);
        if (Graphics.getContext) {
            this.m_CanvasElement = Graphics.getContext("2d");
            this.BoardInit();
            this.BoardButtonsInit(this.m_IDButtonField);
            this.PlayerInit(this.m_IDWinner);
        }
    };
    // ------------------------------------------------------------
    this.ReInit = function (IDDimX, IDDimY, IDCellSize, IDPlayerName) {
        var DimX = $("#" + IDDimX).val();
        var DimY = $("#" + IDDimY).val();
        var CellSize = $("#" + IDCellSize).val();
        var PlayerName = $("#" + IDPlayerName).val();

        this.m_Definitions.ReInit(DimX, DimY, CellSize);
        this.m_PlayerHuman.m_PlayerName = PlayerName;

        this.BoardInit();
        this.BoardButtonsInit(this.m_IDButtonField);
        this.PlayerInit(this.m_IDWinner);
    };
    // ------------------------------------------------------------
    this.PlayerInit = function (IDWinner) {
        $("#" + IDWinner).html("");

        // Human will start in bottom left corner
        this.m_Grid.GridReset();
        this.m_PlayerHuman.Init(this, 0, this.m_Definitions.DimensionY - 1, IDWinner);

        // Computer will start in top right corner
        this.m_Grid.GridReset();
        this.m_PlayerComputer.Init(this, this.m_Definitions.DimensionX - 1, 0, IDWinner);
    };
    // ------------------------------------------------------------
    this.BoardInit = function () {
        var BoardWidth = this.m_Definitions.DimensionX * this.m_Definitions.CellSize;
        var BoardHeight = this.m_Definitions.DimensionY * this.m_Definitions.CellSize;

        $("#moveinfo").html("");
        ElementSetSize($("#" + this.m_IDGameField), BoardWidth, BoardHeight);
        $("#" + this.m_IDGameField).css("border", "1px solid black");
        this.m_Grid.GridInit(this.m_Definitions, this.m_CanvasElement);
    };
    // ------------------------------------------------------------
    this.BoardButtonsInit = function (ButtonField) {
        // Retrive margin size from CSS classn
        var BtnMargin = parseInt($("#fakebtn").css("marginTop"));
        var NumberOfButtons = this.m_Definitions.Colors.length;
        var BtnWidth = parseInt(Math.floor((this.m_Definitions.DimensionX * this.m_Definitions.CellSize) / 5));
        var BtnHeight = parseInt(Math.floor(((this.m_Definitions.DimensionY * this.m_Definitions.CellSize) - ((NumberOfButtons + 1) * BtnMargin)) / NumberOfButtons));
        var GameBoard = this;

        $("#" + ButtonField).children().remove();
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

        // Human move
        this.m_Grid.GridReset();
        this.m_PlayerHuman.Move(this.m_Grid.m_Cells, [NewColor], this.m_Definitions, this.m_CanvasElement);

        // Computer move
        this.m_Grid.GridReset();
        var ValidColors = this.m_Definitions.Colors.filter(AvailableColor => AvailableColor !== NewColor, AvailableColor => AvailableColor !== this.m_PlayerComputer.m_BaseCell.m_Color);
        this.m_PlayerComputer.Move(this.m_Grid.m_Cells, ValidColors, this.m_Definitions, this.m_CanvasElement);
    };
}