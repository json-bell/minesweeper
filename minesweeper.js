function newMinesweeper(xDim = 5, yDim = 5) {
  const totalMines = 10;
  const mineGrid = new minesweepingGrid(xDim, yDim, totalMines);
  mineGrid.htmlVisualisationAll();
  return mineGrid;
}

class cell {
  constructor(xCoord, yCoord) {
    this.x = xCoord;
    this.y = yCoord;
    this.isMine = false;
    this.isFlag = false;
    this.isRevealed = false;
    this.mineNeighbours = 0;
  }

  toggleFlag() {
    this.isFlag = !this.isFlag;
  }

  updateHTML() {
    document.getElementById(`square(${this.x},${this.y})`);
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

function columnRowLayout(number) {
  return Array(number).fill(" 30pt").join("");
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
    // minesweeper-main as a grid element
    const gridStrings = {
      start: `<div id="minesweeper-main" class="minesweeper-grid"
        style="grid-template-columns: ${columnRowLayout(this.xDim)};
        grid-template-rows: ${columnRowLayout(this.yDim)};"
      >`,
      end: "</div>",
    };
    document.getElementById("minesweeper-surrounding").innerHTML =
      gridStrings.start + gridStrings.end;

    // adding all the grid elements simultaneously
    const squareStrings = {
      start: "",
      end: "",
    };
    const stringsForGrid = [];
    for (const row of this.grid) {
      const stringsForRow = [];
      for (const square of row) {
        let squareString = `<button class="minesweeper-square" id="square(${square.x},${square.y})">`;
        squareString += `${square.isMine ? "X" : "_"}`;
        squareString += "</button>";

        stringsForRow.push(squareString);
      }
      stringsForGrid.push(stringsForRow.join(""));
    }
    document.getElementById("minesweeper-main").innerHTML =
      stringsForGrid.join("");
  }
}
