function LQCell(PosX, PosY, CellSize) {
    // ------------------------------------------------------------
    this.Config = {};
    this.Config.PosX = parseInt(PosX);
    this.Config.PosY = parseInt(PosY);
    this.Config.CellSize = parseInt(CellSize);
    this.Config.Color = "white";
    // ------------------------------------------------------------
    this.Draw = function (CanvasElement) {
        CanvasElement.beginPath();
        CanvasElement.rect(this.Config.PosX, this.Config.PosY, this.Config.CellSize, this.Config.CellSize);
        CanvasElement.fillStyle = this.Config.Color;
        CanvasElement.fill();
        CanvasElement.lineWidth = 1;
        CanvasElement.strokeStyle = "black";
        CanvasElement.stroke();
    };
    // ------------------------------------------------------------
    this.ColorSet = function (NewColor) {
        this.Config.Color = NewColor;
    };
}