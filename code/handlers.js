document.onkeydown = function keyDownHandler(event) {
    switch (event.key) {
        case "ArrowUp":
            agent.move(maze, "up");
            break;
        case "ArrowRight":
            agent.move(maze, "right");
            break;
        case "ArrowDown":
            agent.move(maze, "down");
            break;
        case "ArrowLeft":
            agent.move(maze, "left");
            break;
        case "q":
            stepPopulation();
            return; // updateUi() skip karne ke liye direct exit
        case "w":
            evolve();
            return; // updateUi() skip karne ke liye direct exit
        case "m":
            mutateBtnFun()
            return;
        default:
            return; // Koi unrecognized key hone par updateUi() skip hoga
    }

    updateUi();
}

runBtn.onclick = async function runBtnHandler(){
    console.log("run clicked, before fitness: ", fitness)
    const { fitness: newFitness } = runAgent(agent, maze, goal);
    if(newFitness > fitness) {
        fitness = newFitness;
        console.log("if:::: ", {newFitness,fitness});
    }
    else {
        console.log("else:::: ", {newFitness,fitness});
    }
    console.log("run finished after fitness----:", fitness)
}

moveBtn.onclick = function moveBtnHandler(){
    neuralMove(agent, maze);
    updateUi()
}

setTimeout(function (){    // starter 
    updateUi()
    console.log("first ui update")
},500)



//testing....................
mode_selection_container.onclick = setCurrMode
let currMode = populateSingleMode

function setCurrMode(){
    const currModeData = {}

    mode_selection_container
        .querySelectorAll(".mode_setter")
            .forEach(ele => currModeData[ele.id] = ele.checked);

    const {
        singleModeInput,
        multipleModeInput,
        populateModeInput,
        storedModeInput
    } = currModeData

    if(singleModeInput && populateModeInput){
        populateSingleMode();
    }
    else if(singleModeInput && storedModeInput){
        storedSingleMode();
    }
    else if(multipleModeInput && populateModeInput){
        populateMultipleMode();
    }
    else if(multipleModeInput && storedModeInput){
        storedMultipleMode();
    }
}

// agent, maze run in ui and get its fitness
function populateSingleMode(){
    const watchIndex = population.length-1;  // initially set to count of population
    // watchIndex = watchIndexInp.value
    watchAgentSolving(population[watchIndex].network);
}

function storedSingleMode(){
    const nets = JSON.parse(localStorage.getItem("networks"))

    const watchIndex = nets.length-1;
    watchIndexInp.value = watchIndex
}

function populateMultipleMode(){}
function storedMultipleMode(argument) {
    // body...
}

watchBtn.onclick = function(){
    const watchIndex = Number(watchIndexInp.value);
    l(watchIndex)
    // watchAgentSolving(getNetworkFromLocalStorage(watchIndex));
}