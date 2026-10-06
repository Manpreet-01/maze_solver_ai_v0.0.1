class Simulation {
  constructor(canvasId, mazes) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.mazes = mazes;
    
    this.currentLevelIndex = 0;
    this.level = null;

    this.population = [];
    this.generation = 0;

    this.bestFitness = -Infinity;
    this.bestAgent = null;
    this.agentIdx = 0
    
    this.loadLevel(0);
    this.loadRandomPopulation();
    this.idx = 0
  }

  pushRandomAgent(){
    const agent = new Agent(this.level.start.row, this.level.start.col);
    agent.network.mutate(0.5)
    agent.heatMap = this.createAgentsHeatMap(agent, this.level)

    this.population.push(agent);

    return this.population.length;
  }

  pushRandomAgents(count = 10){
    for (var i = 0; i<count; i++) {
      simulation.pushRandomAgent()
    }
    return simulation.population.length;
  }

  pushRandomAgentsUpToPopulationSize(){
    while(simulation.population.length < CONFIG.POPULATION_SIZE){
      simulation.pushRandomAgent()
    }
    return simulation.population.length;
  }

  loadRandomPopulation(){
    for(let i=0; i<CONFIG.POPULATION_SIZE; i++){
        this.pushRandomAgent()
    }
  }

  loadLevel(index) {
    this.currentLevelIndex = index;
    this.level = new Level(this.mazes[index]);
    
    // Resize canvas based on level dimensions
    this.canvas.width = this.level.cols * CONFIG.CELL_SIZE;
    this.canvas.height = this.level.rows * CONFIG.CELL_SIZE;

    this.resetPopulation();

  }

  createAgentsHeatMap(agent, level){
        const heatMap  = []

        for (let row = 0; row<level.rows; row++) {
              const rowArr = []
              
              for (let col = 0; col<level.cols; col++) {
                  rowArr.push(0)
              } 

              heatMap.push(rowArr);
        }

        return heatMap;
    }

  resetPopulation() {
    this.population.forEach(agent => {
        agent.row = this.level.start.row,
        agent.col = this.level.start.col,
        agent.reached = false;
        agent.heatMap = this.createAgentsHeatMap(agent, this.level)
    });
  }

  stepPopulation() {
    let isLevelSolvedByAnyAgent = false;

    for (const agent of this.population) {
      isLevelSolvedByAnyAgent = agent.step(this.level, this.currentLevelIndex);

      if(agent.fitness > this.bestFitness){
        this.bestFitness = agent.fitness;
        this.bestAgent = agent;
      }
    }

    return isLevelSolvedByAnyAgent;
  }
  
  stepPopulationAndEvolve() {
    let isLevelSolvedByAnyAgent = false;

    for (const agent of this.population) {
      if (agent.reached) return;

      isLevelSolvedByAnyAgent = agent.step(this.level, this.currentLevelIndex);

      agent.heatMap[agent.row][agent.col] += 1 // update heatMap

      if(agent.fitness > this.bestFitness){
        this.bestFitness = agent.fitness;
        this.bestAgent = agent;
      }

      if(
        agent.steps>CONFIG.MAX_STEPS || 
        agent.fitness<CONFIG.NEGATIVE_FITNESS_THRESHOLD ||
        this.isAgentLostInMaze(agent)
        ){
        agent.row = this.level.start.row
        agent.col = this.level.start.col
        agent.resetValues()
        
        if(agent.steps % 2 == 0)
          agent.network.mutate();
        else{
          agent.network = new Network();
        }
      }
    }

    return isLevelSolvedByAnyAgent;
  }

  clearCanvas(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawLevel(){ 
    this.level.draw(this.ctx);
  }
  drawAgents(){
    for (const agentIndex in this.population) { // draw all agents
      const agent = this.population[agentIndex]
      agent.draw(this.ctx, agentIndex)
    }
  }

  draw(){
    this.clearCanvas();
    this.drawLevel();
    this.drawAgents();
    this.renderDom();
  }

  renderDom(){
    // agent
    bestFitnessEle.innerText = this.bestFitness

    // evolution
    generationEle.innerText = this.generation;
    mutationRateEle.innerText = CONFIG.MUTATION_RATE;

    // populated
    agentIndexFromPopulatedEle.innerText = this.agentIdx;
    agentCountFromPopulatedEle.innerText = this.population.length;

    // level
    levelEle.innerText = this.currentLevelIndex +1;
    levelsEle.innerText = this.mazes.length;
    winnersCountEle.innerText = this.population.filter(a => a.winLevels.length > 0).length;
  }

  runLevel(levelIndex){
    this.loadLevel(levelIndex);

    let winners = 0;

    for (const agent of this.population) {
      const isReached = agent.run(this.level, this.currentLevelIndex);
      if(isReached) winners++
    }

    if(winners){
      console.log(winners + " agents solved level", this.currentLevelIndex);
    } else {
      console.log("-- agents solved level", this.currentLevelIndex);
    }
  }

  runAllLevels(){
    for(let i=0; i<this.mazes.length; i++){
      this.runLevel(i);
    }
  }



  watchAgentSolving(agent, animationSpeed=500) {
    agent.setPosition(this.level.start.row, this.level.start.col);

    const timer = setInterval(() => {
            if (agent.reached) {
                clearInterval(timer);
                console.log("🎯 MAZE SOLVED ", agent);
                this.idx++
            }
            else if (agent.steps >= CONFIG.MAX_STEPS) {
                clearInterval(timer);
                console.log("🎯 Failed ");
                agent.steps = 0;
                this.idx++
                return;
            }

            if(agent.fitness > this.bestFitness){
              this.bestAgent = agent;
              this.bestFitness = agent.fitness
              bestFitnessEle.innerText = this.bestFitness
            }

            agent.step(this.level, this.currentLevelIndex);

            // showFitnessEle.innerText = agent.fitness
            // showStepsEle.innerText = agent.steps
            // wallHitsEle.innerText = agent.wallHits
            // goalReachedEle.innerText = agent.reached
            // generationEle.innerText = agent.generation

            this.draw();
            agent.draw(this.ctx, "W");

        }, animationSpeed);

    return timer;
}

  getWinners(){
    return this.population.filter(a => a.winLevels.length > 0);
  }


  saveElites(){             // filter winners and sort them by no. of winLevels
    
    const sortedWinners = 
      this.getWinners()
      .sort((a,b) => b.winLevels.length - a.winLevels.length);
    
    this.elites = sortedWinners.slice(0, CONFIG.ELITE_COUNT);
    return this.elites;
  }

  destroyAgentsWhoHasNoRemainingSteps(){
    this.population = this.population.filter(a => a.steps <= CONFIG.MAX_STEPS);
  }

  destroyLooserAgents(){
    this.population = this.population.filter(a => a.winLevels.length > 0);
    return this.population.length;
  }

  isAgentLostInMaze(agent){
    for (let row of agent.heatMap) {
        for(let col of row){
            if (col > CONFIG.LOOPINGTHRESHOLD){
                return true;
            }
        }
    }
  }

  sort(){
    this.population.sort((a,b) => b.winLevels.length - a.winLevels.length);
  }

}