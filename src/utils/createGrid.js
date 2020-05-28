const createGrid = (rows, cols, randomLive) => {
    const grid = []
    for (let i = 0; i < rows * cols; i++) {
        if (Math.floor(Math.random() * randomLive) < 3) { // 30% of cells will be alive
            grid.push(1);
        } else {
            grid.push(0);
        }
    }
    return grid;
}

export default createGrid;