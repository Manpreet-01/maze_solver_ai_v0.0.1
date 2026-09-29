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
    
    this.loadLevel(0);
    this.loadRandomPopulation();
  }

  loadRandomPopulation(){
    for(let i=0; i<CONFIG.POPULATION_SIZE; i++){
        const agent = new Agent(this.level.start.row, this.level.start.col);
        this.population.push(agent);
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

  resetPopulation() {
    this.population.forEach(agent => {
        agent.row = this.level.start.row,
        agent.col = this.level.start.col,
        agent.reached = false;
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
      isLevelSolvedByAnyAgent = agent.step(this.level, this.currentLevelIndex);

      if(agent.fitness > this.bestFitness){
        this.bestFitness = agent.fitness;
        this.bestAgent = agent;
      }

      if(agent.fitness < -100){
        agent.row = this.level.start.row,
        agent.col = this.level.start.col,
        agent.reached = false;
        agent.network.mutate(0.1);
        mutated++
      }
    }

    return isLevelSolvedByAnyAgent;
  }

  draw(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.level.draw(this.ctx);  // draw level

    for (const agentIndex in this.population) { // draw all agents
      const agent = this.population[agentIndex]
      agent.draw(this.ctx, agentIndex)
    }

    // this.renderDom();
  }

  renderDom(){
    // agent
    bestFitnessEle.innerText = this.bestFitness

    // evolution
    generationEle.innerText = this.generation;
    mutationRateEle.innerText = CONFIG.MUTATION_RATE;

    // populated
    agentCountFromPopulatedEle.innerText = this.population.length;

    // level
    levelEle.innerText = this.currentLevelIndex +1;
    levelCountEle.innerText = this.mazes.length;
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
            }
            else if (agent.steps >= CONFIG.MAX_STEPS) {
                clearInterval(timer);
                console.log("🎯 Failed ");
                agent.steps = 0;
                return;
            }

            if(agent.fitness > this.bestFitness){
              this.bestAgent = agent;
              this.bestFitness = agent.fitness
              bestFitnessEle.innerText = this.bestFitness
            }

            agent.step(this.level, this.currentLevelIndex);

            showFitnessEle.innerText = agent.fitness
            showStepsEle.innerText = agent.steps
            wallHitsEle.innerText = agent.wallHits
            goalReachedEle.innerText = agent.reached
            generationEle.innerText = agent.generation

            this.draw();
            agent.draw(this.ctx, "W");

        }, animationSpeed);

    return timer;
}
}