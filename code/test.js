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
    console.log("network mutated.")
}
mutateBtn.onclick = mutateBtnFun

// watchAgentSolving(nets[0])

{
    const nets = JSON.parse(localStorage.getItem("networks"))
    watchIndexInp.value = nets.length -1 ;
}
