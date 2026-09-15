// sigmoid(x) = 1 / (1 + e^-x) activation function
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// sigmoid'(x) = sigmoid(x) × (1 - sigmoid(x))
function sigmoidDerivative(output) {
    return output * (1 - output);
}

function getRandomColor(opacity=1){
    return `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, ${opacity})`
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function findCharacter(maze, character) {

    for (let row = 0; row < maze.length; row++) {

        for (let col = 0; col < maze[row].length; col++) {

            if (maze[row][col] === character) {
                return {
                    row: row,
                    col: col
                };
            }
        }
    }

    return null;
}

function isWall(maze, row, col) {

    if (
        row < 0 ||
        row >= maze.length ||
        col < 0 ||
        col >= maze[0].length
    ) {
        return true;
    }

    return maze[row][col] === "#";
}

function distanceToGoal(agent, goal) {
    // Manhattan distance.
    return Math.abs(agent.row - goal.row) + Math.abs(agent.col - goal.col);
}

function reachedGoal(maze, agent) {
    return maze[agent.row][agent.col] === "G";
}

function calculateReward(oldDistance,newDistance,moved,reachedGoal) {
    let reward = 0;

    // Every step costs something
    reward -= 1;

    // Wall collision or not moving 
    if (!moved || newDistance === oldDistance) {
        reward -= 5;
    }

    // Small progress reward
    if (newDistance < oldDistance) {
        reward += 50;
    }

    // Small penalty for moving away
    if (newDistance > oldDistance) {
        reward -= 10;
    }

    // HUGE reward for solving
    if (reachedGoal) {
        reward += 100;
    }

    return reward;
}


// move 1 step and return {inputs, outputs, direction};
function neuralMove(agent, maze) {
    // 1. Look around
    const inputs = agent.sense(maze);

    // 2. Think
    const outputs = agent.network.predict(inputs);

    // 3. Choose action
    const action = chooseAction(outputs);

    // 4. Convert number to direction
    const direction = actionNames[action];

    // 5. Move
    agent.move(maze, direction);

    return {inputs, outputs, direction};
}

// run many times and return fitness
function runBrain(network, maze) {
    const start = findCharacter(maze, "S");
    const goal = findCharacter(maze, "G");

    const agent = new Agent(start.row, start.col);

    let fitness = 0;

    let previousDistance = distanceToGoal(agent, goal);

    const MAX_STEPS = 100;

    for (let step = 0; step < MAX_STEPS; step++) {

        // 1. Sense the maze
        const inputs = agent.sense(maze);

        // 2. Brain thinks
        const outputs = network.predict(inputs);

        // 3. Pick strongest output
        const action = chooseAction(outputs);

        // 4. Remember position
        const oldRow = agent.row;
        const oldCol = agent.col;

        // 5. Move
        const moved =
            agent.move(
                maze,
                actionNames[action]
            );

        // 6. Reward
        if (!moved) {
            fitness -= 1;
        }

        // Small penalty for taking too long
        fitness -= 0.05;

        // Reward getting closer
        const newDistance =
            distanceToGoal(agent, goal);

        fitness += previousDistance - newDistance;

        previousDistance = newDistance;

        // 7. Did we win?
        if (reachedGoal(maze, agent)) {
            fitness += 100;
            break;
        }
    }

    return fitness;
}



// run by no. of max_steps and eturn { fitness, steps, wallHits, reachedGoal: isReached};
function runAgent(agent, maze, goal, max_steps = 25) {
    let steps = 0;
    let wallHits = 0;
    let reached = false

    for (let step = 0; step < max_steps; step++) {
        steps++;

        const inputs = agent.sense(maze);
        const outputs = agent.network.predict(inputs);

        const action = chooseAction(outputs);
        const direction = actionNames[action];

        const oldDistance = distanceToGoal(agent, goal);

        const moved = agent.move(maze, direction);
        if (!moved) wallHits++;

        const newDistance = distanceToGoal(agent, goal);

        reached = reachedGoal(maze, agent);

        const reward = calculateReward(oldDistance, newDistance, moved, reached);

        agent.fitness += reward;

        if (reached) {
            console.log("goal reached #### runAgent");
            return { fitness: agent.fitness, steps, wallHits, reachedGoal: reached};
            // break;
        }
    }

    // if(!reached) console.log(`failed to reach goal in ${max_steps} steps ### runAgent`);

    return { fitness: agent.fitness, steps, wallHits, reachedGoal: reached};
}

// run by no. of max_steps
async function runAgentAsync(agent, maze, goal, delayBetweenSteps=100) {
    let fitness = 0;
    let steps = 0;
    let wallHits = 0;

    const max_steps = 20;

    for (let step = 0; step < max_steps; step++) {
        await sleep(delayBetweenSteps);
        steps++;

        const inputs = agent.sense(maze);
        const outputs = agent.network.predict(inputs);

        const action = chooseAction(outputs);
        const direction = actionNames[action];

        const oldDistance = distanceToGoal(agent, goal);

        const moved = agent.move(maze, direction);
        if (!moved) wallHits++;

        const newDistance = distanceToGoal(agent, goal);

        const reached = reachedGoal(maze, agent);

        const reward = calculateReward(oldDistance, newDistance, moved, reached);

        fitness += reward;

        if (reached) {
            console.log("goal reached #### runAgentAsync");
            break;
        }
    }

    const isReached = reachedGoal(maze, agent);
    if(!isReached){
        console.log(`failed to reach the goal in ${max_steps} steps ## runAgentAsync`);

        const mutationRate = 0.25
        agent.network.mutate(mutationRate);
        runAgentAsync(agent, maze, goal, 100).then(d => console.log("d::: ", d)); // recursive
    }

    return { fitness, steps, wallHits, reachedGoal: isReached};
}

function setAgentProp(network, row, col) {
    agent.row = row
    agent.col = col
    agent.network = network;
}

function createAgent(row, col, color, network) {
    const agent = new Agent(row, col, color, network);
    agent.network = network;
    return agent;
}

function cloneAgent(agent){
    const clonedAgent = createAgent(agent.row, agent.col, agent.color, agent.network);
    clonedAgent.fitness = agent.fitness;
    return clonedAgent;
}

function chooseAction(outputs) {
    let bestIndex = 0;

    for (let i = 1; i < outputs.length; i++) {
        if (outputs[i] > outputs[bestIndex]) bestIndex = i;
    }

    return bestIndex;
}

function updateBrainDisplay(outputs, direction) {
    const names = [
        "up",
        "right",
        "down",
        "left"
    ];

    for (let i = 0; i < outputs.length; i++) {

        const value = outputs[i];

        document.getElementById(
            names[i] + "Value"
        ).textContent = value.toFixed(2);

        document.getElementById(
            names[i] + "Bar"
        ).style.width = (value * 100) + "%";
    }

    document.getElementById("decision")
        .textContent = direction.toUpperCase();
}


function evaluatePopulation() {
    const results = [];

    for (const agent of population) {
        setAgentProp(agent.network, start.row, start.col);

        const result = runAgent(agent,maze,goal);

        results.push({
            agent,
            fitness: result.fitness,
            steps: result.steps,
            wallHits: result.wallHits,
            reachedGoal: result.reachedGoal
        });
    }

    return results;
}


function restoreLayer(layer, savedLayer) {

    for (let n = 0; n < layer.neurons.length; n++) {

        const neuron = layer.neurons[n];
        const savedNeuron = savedLayer.neurons[n];

        for (let i = 0; i < neuron.weights.length; i++) {
            neuron.weights[i] = savedNeuron.weights[i];
        }

        neuron.bias = savedNeuron.bias;
        neuron.output = savedNeuron.output;
    }
}


function getNetworkFromLocalStorage(index) {
    const savednet = JSON.parse(localStorage.getItem("networks"))[index];
    const network = new Network();

    if(!savednet) {
        alert("failed to get network data from localStorage");
        return network;     // return new random network data
    }


    restoreLayer(network.hidden,savednet.hidden);
    restoreLayer(network.output,savednet.output);

    return network;
}


function mutateNetwork(network, mutationRate = 0.1) {

    for (const neuron of network.hidden.neurons) {

        for (let i = 0; i < neuron.weights.length; i++) {

            neuron.weights[i] +=
                (Math.random() * 2 - 1) *
                mutationRate;
        }

        neuron.bias +=
            (Math.random() * 2 - 1) *
            mutationRate;
    }

    for (const neuron of network.output.neurons) {

        for (let i = 0; i < neuron.weights.length; i++) {

            neuron.weights[i] +=
                (Math.random() * 2 - 1) *
                mutationRate;
        }

        neuron.bias +=
            (Math.random() * 2 - 1) *
            mutationRate;
    }

    return network; // return back by mutating in original network
}

function cloneNetwork(network) {

    const copy = new Network();

    // Copy hidden layer
    for (let i = 0; i < network.hidden.neurons.length; i++) {

        const original = network.hidden.neurons[i];
        const cloned = copy.hidden.neurons[i];

        cloned.weights = [...original.weights];
        cloned.bias = original.bias;
    }

    // Copy output layer
    for (let i = 0; i < network.output.neurons.length; i++) {

        const original = network.output.neurons[i];
        const cloned = copy.output.neurons[i];

        cloned.weights = [...original.weights];
        cloned.bias = original.bias;
    }
    
    copy.fitness = network.fitness;
    return copy;
}


function evolve() {
    const evalResults = evaluatePopulation();

    evalResults.sort((a, b) => b.fitness - a.fitness);  // sort original arr

    const bestResult = evalResults[0];

    if (bestResult.fitness > bestFitness) {
        bestAgent = bestResult.agent;
        bestAgent.fitness = bestResult.fitness;
        bestAgent.network = bestResult.agent.network;
    }

    // population = createNextGeneration_fv1(evalResults);
    population = createNextGeneration_fv2(evalResults);
    generation++;
    console.log("generation evolved to ", generation)
}




function watchAgentSolving(network, animationSpeed=100) {
    agent.network = brain;
    setAgentProp(network, start.row, start.col)

    let step = 0;
    const mutationRate = 0.1;

    const timer = setInterval(function() {
            step++;

            if (step >= MAX_STEPS) {
                console.log("🎯 Failed to SOLVED THE MAZE! in "+ step +" steps");
                step = 0; //reset to zero bcz mutated network starts again from zero
                clearInterval(timer);
                return;
            }

            neuralMove(agent, maze);

            if (reachedGoal(maze, agent)) {
                clearInterval(timer);
                console.log("🎯 MAZE SOLVED " + step +" steps", "animId :: ", timer);
            }

            updateUi();
        }, animationSpeed);
    return timer;
}




function createPopulation(size) {
    const population = [];
    const start = findCharacter(maze, "S");

    for (let i = 0; i < size; i++) {
         population.push(new Agent(start.row, start.col));
    }

    return population;
}



// animate function
function update() {
    stepCount++;
    for (const robot of robots) {
        robot.fitness = stepRobot(robot.agent, maze, robot.brain);
    }

    if (stepCount >= MAX_STEPS) {
        nextGeneration();
        stepCount = 0;
        // return;
    }

    draw();
    animationId = requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawMaze();

    for (const robot of robots) {
        drawAgent(robot.agent);
    }
}

function createRobots() {
    const robots = [];

    for (const brain of population) {

        robots.push(
            new Robot(brain, maze)
        );
    }

    return robots;
}

function stepRobot(agent, maze, network){
    // neuralMove(agent, maze);
    const fitness = runBrain(network, maze)
    drawMaze()
    drawAgent(agent)
    return fitness;
}



function nextGeneration() {
    const results = robots.map(robot => ({
        brain: robot.brain,
        fitness: robot.fitness
    }));

    results.sort((a, b) => b.fitness - a.fitness);
    console.log("Generation:",generation,"results",results[0]);

    bestNetwork = results[0].brain

    population = createNextGeneration_fv1(results);

    // robots = createRobots();

    generation++;
}


function createNextGeneration_fv1(results, mutationAmount=0.2) {
    results.sort(function(a, b) {
        return b.fitness - a.fitness;
    });

    // survivors
    const elites = results.slice(0, ELITE_COUNT).map(result => result.agent);

    const nextGeneration = [];

    // Keep the best network unchanged
    for (const e of elites) {
        const agent = createAgent()
        nextGeneration.push(e);
    }

    // Fill the rest with mutated copies
    while (nextGeneration.length < POPULATION_SIZE) {
        const parent = elites[
                Math.floor(
                    Math.random() * elites.length
                )
            ];

        const childAgent = cloneAgent(parent);
        childAgent.network = cloneNetwork(parent.network);

        mutateNetwork(childAgent.network, mutationAmount);

        nextGeneration.push(childAgent);
    }

    return nextGeneration;
}

function createNextGeneration_fv2(results, mutationAmount = 0.2) {
    results.sort(function(a, b) {
        return b.fitness - a.fitness;
    });

    const nextGeneration = [];
    const survivorCount = ELITE_COUNT;

    for(let i=0; i<survivorCount; i++){    // Keep the best brains unchanged
        nextGeneration.push(results[i].agent);
    }

    while (nextGeneration.length < 100) {
        const parent = results[Math.floor(Math.random() * survivorCount)].agent; // Pick a random survivor

        // const child = parent.clone();  // implement this function
        const childAgent = cloneAgent(parent);
        childAgent.network = cloneNetwork(parent.network);

        // child.mutate(mutationAmount);   // implement this function
        mutateNetwork(childAgent.network, mutationAmount);
        nextGeneration.push(childAgent);
    }

    return nextGeneration;
}









// running all population for 1 step by one click or button press
function stepPopulation(){
    let i = 0;
    ctx.clearRect(0, 0, canvas.width,canvas.height);
    drawMaze();

    population.forEach(agent => {
        const inputs = agent.sense(maze);
        const outputs = agent.network.predict(inputs);
        const action = chooseAction(outputs);

        const oldDistance = distanceToGoal(agent, goal);
        const moved = agent.move(maze, actionNames[action]);
        const newDistance = distanceToGoal(agent, goal);

        const reached = reachedGoal(maze, agent);
        const reward = calculateReward(oldDistance, newDistance, moved, reached);

        if(reached){
            console.log("i= " + i + " reached goal, finesss= " + agent.fitness);
            agent.reachedGoal = true;
            saveNewBrainToLocalStorage(i);
        }else {
            agent.fitness += reward;
        }

        drawAgent(agent);
        drawLabel(
            agent.col * CELL_SIZE + CELL_SIZE/2,
            agent.row * CELL_SIZE + CELL_SIZE/2,
            i++,
            ctx
        )
    });
}