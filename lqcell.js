function LQCell(PosX, PosY, CellSize) {
    // ------------------------------------------------------------
    this.Config = {};
    this.Config.PosX = parseInt(PosX);
    this.Config.PosY = parseInt(PosY);
    this.Config.CellSize = parseInt(CellSize);
    this.Config.Color = "white";
    // ------------------------------------------------------------
    this.Draw = function (CanvasElement) {
        // console.log(JSON.stringify(this.Config));
        CanvasElement.beginPath();
        CanvasElement.rect(parseInt(this.Config.PosX), parseInt(this.Config.PosY), parseInt(this.Config.CellSize), parseInt(this.Config.CellSize));
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