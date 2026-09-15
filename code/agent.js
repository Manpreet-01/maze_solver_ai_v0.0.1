class Agent {
    constructor(row=0, col=0, color, network) {
        this.row = row;
        this.col = col;
        this.fitness = 0;
        this.color = color ? color : getRandomColor();
        this.network = network ? network : new Network();
        this.network.fitness = this.fitness;
    }
    setPosition(row, col){
        this.row = row;
        this.col = col;
    }
    setFitness(fitness){
        this.fitness = fitness;
        this.network.fitness = fitness;
    }
    sense(maze) {
        const up =
            isWall(
                maze,
                this.row - 1,
                this.col
            );

        const right =
            isWall(
                maze,
                this.row,
                this.col + 1
            );

        const down =
            isWall(
                maze,
                this.row + 1,
                this.col
            );

        const left =
            isWall(
                maze,
                this.row,
                this.col - 1
            );

        return [
            up ? 1 : 0,
            right ? 1 : 0,
            down ? 1 : 0,
            left ? 1 : 0
        ];
    }

    move(maze, direction) {
        const [dr, dc] = directions[direction];

        const newRow = this.row + dr;
        const newCol = this.col + dc;

        if (maze[newRow][newCol] === "#") return false;

        this.row = newRow;
        this.col = newCol;

        return true;
    }
}