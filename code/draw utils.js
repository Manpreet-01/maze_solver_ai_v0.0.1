function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {

            const cell = maze[row][col];

            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;

            // Background
            if (cell === "#") {
                ctx.fillStyle = "black";
            } else {
                ctx.fillStyle = "white";
            }

            ctx.fillRect(x,y,CELL_SIZE,CELL_SIZE);

            // Grid
            ctx.strokeStyle = "#555";
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

            // Start
            if (cell === "S") {
                ctx.fillStyle = "green";
                ctx.fillRect(x + 10, y + 10, CELL_SIZE - 20, CELL_SIZE - 20);
            }

            // Goal
            if (cell === "G") {
                ctx.fillStyle = "red";
                ctx.fillRect(x + 10,y + 10,CELL_SIZE - 20,CELL_SIZE - 20);
            }
        }
    }
}

function drawAgent(agent) {
    const x = agent.col * CELL_SIZE;
    const y = agent.row * CELL_SIZE;

    ctx.fillStyle = agent.color;
    ctx.beginPath();
    ctx.arc(
        x + CELL_SIZE / 2,
        y + CELL_SIZE / 2,
        CELL_SIZE / 3,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function drawNetwork(network, inputs, action) {
    // Draw inputs
    for (let i = 0; i < inputs.length; i++) {
        drawNeuron(
            xInput,
            marginTop + i * gapY,
            inputs[i],
            i == action // isActivated
        );
    }

    // Draw hidden neurons
    for (let i = 0; i < network.hidden.neurons.length; i++) {
        drawNeuron(
            xHidden,
            marginTop + i * gapY,  // - decreases margin top
            network.hidden.neurons[i].output,
            i == action // isActivated
        );
    }

    // Draw outputs
    for (let i = 0; i < network.output.neurons.length; i++) {
        drawNeuron(
            xOutput,
            marginTop + i * gapY,
            network.output.neurons[i].output,
            i == action // isActivated
        );
    }
}


function drawNeuron(x, y, value, isActivated=false) {
    const ctx = ctx2;
    ctx.beginPath();

    ctx.arc(
        x,
        y,
        20,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = `rgb(${value * 255}, 100, 100)`;
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(value.toFixed(2),x,y + 5);

    if(isActivated){
        ctx.lineWidth = 3
        ctx.strokeStyle = 'white'
        ctx.stroke()
        ctx.lineWidth = 1
    } else {
        ctx.strokeStyle = 'black'
    }
}

function drawConnections(network) {
    const ctx = ctx2; // test

    // Input → Hidden
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            ctx.beginPath();
            ctx.moveTo(xInput,marginTop + i * gapY);
            ctx.lineTo(xHidden,marginTop + j * gapY);

            ctx.strokeStyle = "#555";
            ctx.stroke();
        }
    }

    // Hidden → Output
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
            ctx.beginPath();
            ctx.moveTo(xHidden,marginTop + i * gapY);
            ctx.lineTo(xOutput,marginTop + j * gapY);

            ctx.strokeStyle = "#555";
            ctx.stroke();
        }
    }

    ctx.strokeStyle = "black";
}


function drawLabel(x,y,label, ctx) {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(label,x,y);
}


function updateUi(){
    const inputs = agent.sense(maze);
    const outputs = agent.network.predict(inputs);
    const action = chooseAction(outputs);
    const direction = actionNames[action];
    
    ctx.clearRect(0, 0, canvas.width,canvas.height);
    ctx2.clearRect(0, 0, canvas2.width,canvas2.height);

    updateBrainDisplay(outputs, direction)
    drawMaze()
    drawAgent(agent)

    drawConnections(agent.network,xInput,xHidden,xOutput);
    drawNetwork(agent.network, inputs, action);
}
