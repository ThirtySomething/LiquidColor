function LQBoard(DimX, DimY, CellSize) {
    // ------------------------------------------------------------
    this.Config = {};
    this.Config.DimensionX = parseInt(DimX);
    this.Config.DimensionY = parseInt(DimY);
    this.Config.CellSize = parseInt(CellSize);
    this.Config.Colors = ["blue", "cyan", "gray", "green", "red", "yellow"];
    // ------------------------------------------------------------
    this.Playground = {};
    this.Playground.Cells = [];
    this.Playground.CanvasElement = null;
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
            this.Playground.CanvasElement = Graphics.getContext("2d");
            this.BoardButtonsInit(ButtonField)
            this.BoardInit();
        }
    };
    // ------------------------------------------------------------
    this.BoardInit = function () {
        this.Playground.Cells = [];

        for (var LoopX = 0; LoopX < this.Config.DimensionX; LoopX++) {
            for (var LoopY = 0; LoopY < this.Config.DimensionY; LoopY++) {
                var CellSize = this.Config.CellSize;
                var PosX = LoopX * CellSize;
                var PosY = LoopY * CellSize;
                var ColorIndex = Math.floor((Math.random() * this.Config.Colors.length));
                var ColorName = this.Config.Colors[ColorIndex];
                var CurrentCell = new LQCell(PosX, PosY, CellSize);

                CurrentCell.ColorSet(ColorName);
                CurrentCell.Draw(this.Playground.CanvasElement);
                this.Playground.Cells.push(CurrentCell);
            }
        }
    };
    // ------------------------------------------------------------
    this.BoardButtonsInit = function (ButtonField) {
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
            $("#" + CurCol).hover(function () {
                $(this).css("cursor", "pointer");
            });
        }
    }
}