const CONFIG = {			// --- CONFIG & CONSTANTS ---
  CELL_SIZE: 30,
  MAX_STEPS: 20,
  ELITE_COUNT: 20,
  MUTATION_RATE: 0.1,
  POPULATION_SIZE: 50_000,
  LOOPINGTHRESHOLD: 20,
  HEATMAPTHRESHOLD: 30,
  NEGATIVE_FITNESS_THRESHOLD: -2500,
};

let mutated = 0;


const simulation = new Simulation('mazeCanvas', mazes, 0);
// simulation.runAllLevels();
// simulation.saveElites()


const canvas3 = document.getElementById("mazeCanvas3");
const ctx3 = canvas3.getContext("2d");

canvas3.width = CONFIG.CELL_SIZE * simulation.level.rows
canvas3.height = CONFIG.CELL_SIZE * simulation.level.cols



function dropUselessAgents(){
  simulation.population.forEach(agent => {
    if(agent.steps>CONFIG.MAX_STEPS){
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
	// simulation.stepPopulation()
  simulation.stepPopulationAndEvolve()

  if(!simulation.population.length){            // all died, so try new mutated agents
    simulation.pushRandomAgentsUpToPopulationSize();

    simulation.population.forEach(a => {
      random() > 0.5
        ? a.network.mutate(CONFIG.MUTATION_RATE)
        : a.network.mutate(-CONFIG.MUTATION_RATE)
      
      a.mutated++
    });

    simulation.generation++
  }
	
  simulation.draw()
  simulationSteps.innerText = Number(simulationSteps.innerText) + 1
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

const intId = setInterval(step, 300)




function renderAgentsPositionsInDom(){
    let str = ''
  simulation.population.forEach(a => {
    const pos = a.getPosition();
    str += pos.row +"  " + pos.col + "\n";
  });
  agent_position_fieldset_div.innerText = str
}