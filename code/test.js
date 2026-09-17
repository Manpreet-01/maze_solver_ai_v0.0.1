canvas2.style.display = 'none'

function saveNewBrainToLocalStorage(index=-1){
	const nets = JSON.parse(localStorage.getItem("networks"))
	const net = population[index].network
    nets.push(net)

    const networksData = JSON.stringify(nets)
    localStorage.setItem("networks", networksData);
    console.log("saved:: ", JSON.parse(networksData));
}
    
function mutateBtnFun(){
    mutateNetwork(agent.network, mutationRate);
}

function  changeMutationRate(e){
    mutationRate =  Number(e.target.value);
}

mutateBtn.onclick = mutateBtnFun
mutateRateInp.onchange = changeMutationRate;

{   
    // set last index in watchIndexInp's value in html input element
    const nets = JSON.parse(localStorage.getItem("networks"))
    watchIndexInp.value = nets.length -1 ;
}

async function runAllLocalStorageAgents(){
    const nets = JSON.parse(localStorage.getItem("networks"));
    for (const i in nets){
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


