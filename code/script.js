// --- CONFIG & CONSTANTS ---
const CONFIG = {
  CELL_SIZE: 40,
  MAX_STEPS: 15,
  POPULATION_SIZE: 1,
  ELITE_COUNT: 10,
  MUTATION_RATE: 0.1,
};

let mutated = 0

const simulation = new Simulation('mazeCanvas', mazes);

// simulation.runAllLevels();

function seeLevel(index){
	simulation.loadLevel(index)
	simulation.level.draw(simulation.ctx);
}

function testing(){
	const testLevelIndex = simulation.mazes.length -1;
	seeLevel(testLevelIndex)
	simulation.runLevel(testLevelIndex);
}

function step(){
	// simulation.stepPopulation()
	simulation.stepPopulationAndEvolve()
	simulation.draw()
}

// setInterval(step, 100)

// testing()


function saveElites(){
	// filter winner and sort them by winLevels lengthss
	const sortedWinners = simulation.population.filter(a => a.winLevels.length > 0)
												.sort((a,b) => b.winLevels.length - a.winLevels.length);
	
	simulation.elites = sortedWinners.slice(0, CONFIG.ELITE_COUNT);
}


function destroyLooserAgents(){
	simulation.population = simulation.population.filter(a => a.winLevels.length > 0);
}