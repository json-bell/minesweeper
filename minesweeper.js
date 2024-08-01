function newMinesweeper(dimension) {
  const xDim = dimension + 5;
  const yDim = dimension;
  const totalMines = 10;
  const mineGrid = new minesweepingGrid(xDim, yDim, totalMines);
  return mineGrid;
}

class cell {
  constructor(xCoord, yCoord) {
    this.coords = [xCoord, yCoord];
    this.isMine = false;
    this.isFlag = false;
    this.mineNeighbours = 0;
  }

  toggleFlag() {
    this.isFlag = !this.isFlag;
  }
}

function makeEmptyGrid(xDim, yDim) {
  const grid = [];
  for (let x = 0; x < xDim; x++) {
    grid.push([]);
    for (let y = 0; y < yDim; y++) {
      grid[x].push(new cell(x, y));
    }
  }
  return grid;
}

function randomInt(maxVal) {
  return Math.floor(Math.random() * maxVal);
}

class minesweepingGrid {
  constructor(xDim, yDim, totalMines) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.grid = makeEmptyGrid(xDim, yDim);
    this.totalMines = totalMines;
    this.currentMine; // Temporary variable for testing addMine()
    this.initialise();
  }

  countMines() {
    let mineCount = 0;
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell.isMine) mineCount++;
      }
    }
    return mineCount;
  }

  countFlags() {
    let flagCount = 0;
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell.isFlag) flagCount++;
      }
    }
    return flagCount;
  }

  addRandomMine() {
    let hasAdded = false;
    const mineCount = this.countMines();

    while (!hasAdded) {
      const newX = randomInt(this.xDim);
      const newY = randomInt(this.yDim);

      console.log(
        `Trying to add mine number ${mineCount + 1} at x=${newX} and y=${newY}`
      );
      if (this.grid[newX][newY].isMine === false) {
        this.grid[newX][newY].isMine = true;
        hasAdded = true;
      }
    }
  }

  initialise() {
    while (this.countMines() < this.totalMines) {
      this.addRandomMine();
    }
  }

  visualiseGrid() {
    const visuals = [];
    for (const row of this.grid) {
      const viewedRow = [];
      for (const cell of row) {
        if (cell.isMine) viewedRow.push("X");
        else viewedRow.push(".");
      }
      visuals.push(viewedRow);
    }
    return visuals;
  }
}

console.log(newMinesweeper(4).visualiseGrid());
