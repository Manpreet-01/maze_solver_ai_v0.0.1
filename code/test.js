

// step()



function setAgent____(agent, newPos) {
    const grid = simulation.level.grid;
    const rows = grid.length;
    const cols = grid[0].length;
    const goal = simulation.level.goal;

    // 1. Base case: out of bounds
    if (
        newPos.row < 0 || newPos.row >= rows ||
        newPos.col < 0 || newPos.col >= cols
    ) {
        return false;
    }

    // 2. Base case: goal reached
    if (
        newPos.row === goal.row &&
        newPos.col === goal.col
    ) {
        return {
            ...agent,
            row: newPos.row,
            col: newPos.col,
            reachedGoal: true
        };
    }

    // 3. Try moving down
    const down = setAgent(agent, {
        row: newPos.row + 1,
        col: newPos.col
    });

    if (down) {
        return down;
    }

    // 4. Try moving right
    const right = setAgent(agent, {
        row: newPos.row,
        col: newPos.col + 1
    });

    if (right) {
        return right;
    }

    // 5. Neither direction found a solution
    return false;
}

// const agent = simulation.population[0];

// const ans = setAgent(agent, {
    // row: agent.row,
    // col: agent.col
// });

// console.log(ans);


