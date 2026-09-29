class Level {
    constructor(mazeData) {
        this.grid = mazeData;
        this.start = findCharacter(mazeData, 'S');
        this.goal = findCharacter(mazeData, 'G');
        this.cols = mazeData[0].length;
        this.rows = mazeData.length;
    }

    draw(ctx) {
        const CELL_SIZE = CONFIG.CELL_SIZE;

        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {

                const cell = this.grid[row][col];

                const x = col * CELL_SIZE;
                const y = row * CELL_SIZE;

                // Background
                if (cell === "#") {
                    ctx.fillStyle = "black";
                } else {
                    ctx.fillStyle = "white";
                }

                ctx.fillRect(x,y,CELL_SIZE,CELL_SIZE);

                // Grid
                ctx.strokeStyle = "#555";
                ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

                // Start
                if (cell === "S") {
                    ctx.fillStyle = "green";
                    ctx.fillRect(x + 10, y + 10, CELL_SIZE - 20, CELL_SIZE - 20);
                }

                // Goal
                if (cell === "G") {
                    ctx.fillStyle = "red";
                    ctx.fillRect(x + 10,y + 10,CELL_SIZE - 20,CELL_SIZE - 20);
                }
            }
        }
    }
}