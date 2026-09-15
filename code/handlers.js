function keyDownHandler(event) {
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