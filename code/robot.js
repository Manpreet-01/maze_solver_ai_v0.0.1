class Robot {

    constructor(brain, maze) {

        this.brain = brain;

        const start =
            findCharacter(maze, "S");

        this.agent =
            new Agent(
                start.row,
                start.col
            );

        this.fitness = 0;
        this.alive = true;

        this.previousDistance =
            distanceToGoal(
                this.agent,
                goal
            );
    }
}     