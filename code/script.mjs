const CONFIG = {			// --- CONFIG & CONSTANTS ---
  CELL_SIZE: 30,
  MAX_STEPS: 200,
  POPULATION_SIZE: 5,
  ELITE_COUNT: 20,
  MUTATION_RATE: 0.1,
  LOOPINGTHRESHOLD: 20,
  NEGATIVE_FITNESS_THRESHOLD: -20000,
};

let mutated = 0;


const simulation = new Simulation('mazeCanvas', mazes);
// simulation.runAllLevels();
// simulation.saveElites()



function step(){
	// simulation.stepPopulation()
  simulation.stepPopulationAndEvolve()
	
  simulation.draw()
  simulationSteps.innerText = Number(simulationSteps.innerText) + 1
}

// function manageAgents(){
  // simulation.destroyAgentsWhoHasNoRemainingSteps()
  // simulation.pushRandomAgentsUpToPopulationSize()
// }

setInterval(step, 1000)

