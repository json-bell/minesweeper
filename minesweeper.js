function newMinesweeper(xDim = 7, yDim = 7) {
  const totalMines = 10;
  const mineGrid = new minesweepingGrid(xDim, yDim, totalMines);
  mineGrid.htmlVisualisationAll();
  return mineGrid;
}

class cell {
  constructor(xCoord, yCoord) {
    this.coords = [xCoord, yCoord];
    this.isMine = false;
    this.isFlag = false;
    this.isRevealed = false;
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

  textVisualisationAll() {
    const visuals = [];
    for (const row of this.grid) {
      const viewedRow = [];
      for (const cell of row) {
        if (cell.isMine) viewedRow.push("X");
        else viewedRow.push("_");
      }
      visuals.push(viewedRow);
    }
    return visuals;
  }

  htmlVisualisationAll() {
    const gridStrings = {
      start: "",
      end: "",
    };
    const squareStrings = {
      start: "",
      end: "",
    };
    document.getElementById("minesweeper-main").innerHTML = `<br>`;
    for (const row of this.grid) {
      document.getElementById("minesweeper-main").innerHTML += `<br>`;
      for (const square of row) {
        document.getElementById("minesweeper-main").innerHTML += `${
          square.isMine ? "X" : "_"
        },`;
      }
    }
  }
}

console.log(newMinesweeper(4).textVisualisationAll());
