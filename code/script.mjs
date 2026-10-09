const CONFIG = {			// --- CONFIG & CONSTANTS ---
  CELL_SIZE: 30,
  MAX_STEPS: 200,
  ELITE_COUNT: 20,
  MUTATION_RATE: 0.1,
  POPULATION_SIZE: 1000,
  LOOPINGTHRESHOLD: 20,
  HEATMAPTHRESHOLD: 30,
  NEGATIVE_FITNESS_THRESHOLD: -1000,
};

const simulation = new Simulation('mazeCanvas', mazes, 3);

const canvas3 = document.getElementById("mazeCanvas3");
const ctx3 = canvas3.getContext("2d");

canvas3.width = CONFIG.CELL_SIZE * simulation.level.rows
canvas3.height = CONFIG.CELL_SIZE * simulation.level.cols


const intId = setInterval(step, 250)


function saveAgentToLocalStorage(agent){
    if(!agent){
        console.warn("Please provide an agent object")
    }
    
    const savedAgents = JSON.parse(localStorage.getItem("agents")) || []
    savedAgents.push(agent)

    const agentsData = JSON.stringify(savedAgents)
    localStorage.setItem("agents", agentsData);
}

function saveAgents(count=3){
  simulation.population.sort((a,b) => a.wallHits - b.wallHits);
  
  for (let i = 0; i<count; i++){
    saveAgentToLocalStorage(simulation.population[i])
  }
}

function getAgentsFromLocalStorage(){
    const restoredAgents = JSON.parse(localStorage.getItem("agents")) || []

    if(!restoredAgents || !restoredAgents.length){
        console.error("No agents found in localStorage")
    }

    simulation.population = restoredAgents.map(restoreAgent);
}

function restoreAgent(data) {
    const agent = Object.assign(new Agent(), data);
    const network = Object.assign(new Network(), data.network);

    network.hidden = Object.assign(new Layer(0, 0), data.network.hidden);
    network.output = Object.assign(new Layer(0, 0), data.network.output);

    network.hidden.neurons = data.network.hidden.neurons.map(
        neuronData => Object.assign( new Neuron(0), neuronData)
    );

    network.output.neurons = data.network.output.neurons.map(
        neuronData => Object.assign( new Neuron(0), neuronData)
    );

    agent.network = network;
    return agent;
}


async function runAllLocalStorageAgents(){
    const agents = JSON.parse(localStorage.getItem("agents")) || [];
    agentCountFromLocalStorageEle.innerText = agents.length

    for (const i in agents){
        agentIndexFromLocalStorageEle.innerText = i
        watchAgentSolving(getNetworkFromLocalStorage(i));
        await sleep(500);
    }

}

function cutLocalStorageNetworksArray(index){
    if(!index || typeof index != 'number')return;

    const nets = JSON.parse(localStorage.getItem("networks"))
    nets.length = 50

    const networksData = JSON.stringify(nets)
    localStorage.setItem("networks", networksData);
}



function dropUselessAgents(){
  simulation.population.forEach(agent => {
    if(agent.fitness < CONFIG.NEGATIVE_FITNESS_THRESHOLD){
      simulation.population = simulation.population.filter(a => a != agent);
    }
  })
}

window.onkeypress = (a) => {
  if (a.key == 'q') {
    dropUselessAgents();
    l("dropped")
  }
}

function step(){
  simulation.stepPopulationAndEvolve()

  if(!simulation.population.length){            // all died, so try new mutated agents
    simulation.pushRandomAgentsUpToPopulationSize();

    simulation.population.forEach(a => {
      random() > 0.5
        ? a.network.mutate(CONFIG.MUTATION_RATE)
        : a.network.mutate(-CONFIG.MUTATION_RATE)
      
      a.generation++
    });

    simulation.generation++
  }
	
  simulation.draw()
  simulationSteps.innerText = Number(simulationSteps.innerText) + 1
  bestFitnessEle.innerText =  simulation.bestFitness
  // renderAgentsPositionsInDom()
}



function showHeatMapHelperFun(index){
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

  showHeatMap(simulation.population[index], ctx3)
}

// function manageAgents(){
  // simulation.destroyAgentsWhoHasNoRemainingSteps()
  // simulation.pushRandomAgentsUpToPopulationSize()
// }


function renderAgentsPositionsInDom(){
    let str = ''
  simulation.population.forEach(a => {
    const pos = a.getPosition();
    str += pos.row +"  " + pos.col + "\n";
  });
  agent_position_fieldset_div.innerText = str
}