const ELITE_COUNT = 10
const CELL_SIZE = 50;
const MAX_STEPS = 25;
const POPULATION_SIZE = 100;

const maze = mazes[6]; // change maze here

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
canvas.width = maze[0].length * CELL_SIZE;
canvas.height = maze.length * CELL_SIZE;

const canvas2 = document.getElementById("mazeCanvas2");
const ctx2 = canvas2.getContext("2d");
canvas2.width = CELL_SIZE * maze[0].length
canvas2.height = CELL_SIZE * maze.length

const xInput = CELL_SIZE/2;     // for drawing network, connections, neurons on second canvas
const xHidden = CELL_SIZE * 4;
const xOutput = CELL_SIZE * 7.5;
const gapY = 60
const marginTop = 50

let animationId = 0;
let generation = 0;
let bestNetwork = null;
let stepCount = 0;
let mutationRate = 0.1

let population = createPopulation(POPULATION_SIZE);
// let robots = createRobots();

const goal = findCharacter(maze, 'G');
const start = findCharacter(maze, "S");

const agent = new Agent(start.row, start.col);

const restoreNetworkFromLocalStorage = !false;

agent.network = restoreNetworkFromLocalStorage
    ? agent.network = getNetworkFromLocalStorage(0)
    : agent.network = new Network();

let bestAgent = agent;
let fitness = agent.fitness;
let bestFitness = bestAgent.fitness;


// testing
runBtn.onclick = async function recursive(){
    console.log("run clicked", fitness)
    const { fitness: newFitness } = runAgent(agent, maze, goal);
    if(newFitness > fitness) {
        fitness = newFitness;
        console.log("if:::: ", {newFitness,fitness});
        // return;
    }
    else {
        // await sleep(1000)
        console.log("else:::: ", {newFitness,fitness});
        // recursive();
    }
    console.log("run finished")
}

moveBtn.onclick = () => {
    neuralMove(agent, maze);
    updateUi()
}

watchBtn.onclick = () => {
    const watchIndex = Number(watchIndexInp.value);
    watchAgentSolving(getNetworkFromLocalStorage(watchIndex));
}

// document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keypress", keyDownHandler);
stepAllBtn.onclick = stepPopulation;

// starter 
setTimeout(()=>{
    updateUi()
    console.log("first ui update")
},500)
