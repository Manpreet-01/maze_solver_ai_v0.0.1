class Agent {
    constructor(row=0, col=0, color, network) {
        this.row = row;
        this.col = col;
        this.fitness = 0;
        this.color = color ? color : getRandomColor();
        this.network = network ? network : new Network();
        this.reached = false;
        this.winLevels = [];
        this.wallHits = 0;
        this.steps = 0;
    }
    setPosition(row, col){
        this.row = row;
        this.col = col;
    }
    setFitness(fitness){
        this.fitness = fitness;
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

    step (level, levelIndex) {
        if (this.reached){
            console.log("agent step stricted, debug this");
            return true;
        }

        const maze = level.grid;
        const inputs = this.sense(maze);
        const outputs = this.network.predict(inputs);

        const action = chooseAction(outputs);
        const direction = actionNames[action];

        const oldDistance = distanceToGoal(this, level.goal);

        const moved = this.move(maze, direction);
        if (!moved)this.wallHits++;
        
        const newDistance = distanceToGoal(this, level.goal);

        this.reached = reachedGoal(maze, this);

        const reward = calculateReward(oldDistance, newDistance, moved, this.reached);

        this.fitness += reward;

        if (this.reached) {
            this.winLevels.push(levelIndex);
            this.winLevels = Array.from(new Set(this.winLevels)); // to avoiding duplicates
        }
        
        this.steps++;
        return this.reached;
    }

    run(level, levelIndex){
        for(let i=0; i<CONFIG.MAX_STEPS; i++){
            const isSolved = this.step(level, levelIndex);
            if(isSolved) return isSolved;
        }
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

    draw(ctx, label) {
        const CELL_SIZE = CONFIG.CELL_SIZE

        const x = this.col * CELL_SIZE;
        const y = this.row * CELL_SIZE;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            x + CELL_SIZE / 2,
            y + CELL_SIZE / 2,
            CELL_SIZE / 3,
            0,
            Math.PI * 2
        );
        ctx.fill();

        if(label) {
            drawLabel(
                this.col * CELL_SIZE + CELL_SIZE/2,
                this.row * CELL_SIZE + CELL_SIZE/2,
                label,
                ctx
            )
        }
    }
}