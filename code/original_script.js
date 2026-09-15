const MAX_STEPS = 100;
const POPULATION_SIZE = 100;
const ELITE_COUNT = 10
const CELL_SIZE = 60;

let network = new Network();
let generation = 0;
let bestNetwork = null;
let fitness = Infinity;
let bestFitness = -Infinity;
let animationId = 0;

let stepCount = 0;
const maxSteps = 300;


debugger

const goal = findCharacter(maze, 'G');
const start = findCharacter(maze, "S");

const agent = new Agent(
    start.row,
    start.col
);

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
canvas.width = maze[0].length * CELL_SIZE;
canvas.height = maze.length * CELL_SIZE;



function createPopulation(size) {
    const population = [];

         population.push(new Network());
    }
 for (let i = 0; i < size; i++) {
  
    return population;
}

let population = createPopulation(POPULATION_SIZE);


document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowUp") {
        agent.move(maze, "up");
    }

    if (event.key === "ArrowRight") {
        agent.move(maze, "right");
    }

    if (event.key === "ArrowDown") {
        agent.move(maze, "down");
    }

    if (event.key === "ArrowLeft") {
        agent.move(maze, "left");
    }

    drawMaze();
    drawAgent(agent);
});


// for (let i = 0; i < 100; i++) {
//     evolve();
// }

// watchbestNetwork();