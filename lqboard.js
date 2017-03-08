"use strict";

function LQBoard(DimX, DimY, CellSize) {
    // ------------------------------------------------------------
    // Board config
    this.Config = {};
    this.Config.DimensionX = parseInt(DimX);
    this.Config.DimensionY = parseInt(DimY);
    this.Config.CellSize = parseInt(CellSize);
    this.Config.Colors = ["blue", "cyan", "gray", "green", "red", "yellow"];
    this.Config.Cells = [];
    this.Config.CanvasElement = null;
    // ------------------------------------------------------------
    this.Init = function (GameField, ButtonField) {
        var BoardWidth = this.Config.DimensionX * this.Config.CellSize;
        var BoardHeight = this.Config.DimensionY * this.Config.CellSize;
        $("#" + GameField).css("width", BoardWidth);
        $("#" + GameField).css("height", BoardHeight);
        $("#" + GameField).css("border", "1px solid black");
        $("#" + GameField).attr("width", BoardWidth);
        $("#" + GameField).attr("height", BoardHeight);

        var Graphics = document.getElementById(GameField);
        if (Graphics.getContext) {
            this.Config.CanvasElement = Graphics.getContext("2d");
            this.BoardButtonsInit(ButtonField)
            this.BoardInit();
        }
    };
    // ------------------------------------------------------------
    this.BoardInit = function () {
        this.Config.Cells = [];

        for (var LoopY = 0; LoopY < this.Config.DimensionY; LoopY++) {
            for (var LoopX = 0; LoopX < this.Config.DimensionX; LoopX++) {
                var CellSize = this.Config.CellSize;
                var PosX = LoopX * CellSize;
                var PosY = LoopY * CellSize;
                var ColorIndex = Math.floor((Math.random() * this.Config.Colors.length));
                var ColorName = this.Config.Colors[ColorIndex];
                var CurrentCell = new LQCell(PosX, PosY, CellSize);

                CurrentCell.ColorSet(ColorName);
                CurrentCell.Draw(this.Config.CanvasElement);
                this.Config.Cells.push(CurrentCell);
            }
        }

        // ToDo: Computer and human are not allowed to have the same color on startup
        // ToDo: Update surrounding cells of same color with owner and occupy flag

        var IndexComputer = this.Config.DimensionX - 1;
        this.Config.Cells[IndexComputer].OwnerSet("computer");

        var IndexPlayer = this.Config.DimensionX * (this.Config.DimensionY - 1);
        this.Config.Cells[IndexPlayer].OwnerSet("human");
    };
    // ------------------------------------------------------------
    this.BoardButtonsInit = function (ButtonField) {
        // Retrive margin size from CSS classn
        var BtnMargin = parseInt($(".gamebtn").css("margin"));
        var NumberOfButtons = this.Config.Colors.length;
        var BtnWidth = Math.floor((this.Config.DimensionX * this.Config.CellSize) / 5);
        var DimMulCell = Math.floor(this.Config.DimensionY * this.Config.CellSize);
        var BtnHeight = Math.floor(((this.Config.DimensionY * this.Config.CellSize) - ((NumberOfButtons + 1) * BtnMargin)) / NumberOfButtons);

        for (var Loop = 0; Loop < NumberOfButtons; Loop++) {
            var CurCol = this.Config.Colors[Loop];
            var Button = $("#" + ButtonField).append("<div id=\"" + CurCol + "\"></div>");
            $("#" + CurCol).css("width", BtnWidth);
            $("#" + CurCol).css("height", BtnHeight);
            $("#" + CurCol).css("background-color", CurCol);
            $("#" + CurCol).addClass("gamebtn");
            $("#" + CurCol).unbind("click").bind("click", function () {
                console.log("Button for color [" + this.id + "]")
            });
        }
    };
    // ------------------------------------------------------------
    this.BoardConfigGet = function () {
        return this.Config;
    };
}