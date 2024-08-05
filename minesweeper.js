function newMinesweeper(totalCols = 20, totalRows = 5, totalMines = 3) {
  const mineGrid = new minesweepingGrid(totalRows, totalCols, totalMines);
  mineGrid.htmlVisualisationAll();
  return mineGrid;
}

// window.addEventListener("click", function (e) {
//   if (e.shiftKey) console.log("shift!!");
//   else console.log("no shift :(");
// });

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
class cell {
  constructor(xCoord, yCoord) {
    this.x = xCoord;
    this.y = yCoord;
    this.isMine = false;
    this.isFlag = false;
    this.isRevealed = false;
    this.neighbourMineCount = "_";
    this.temp = "NO";
  }

  toggleFlag() {
    this.isFlag = !this.isFlag;
  }

  clicked(mineGrid) {
    // const shifted = window.addEventListener("click", function (e) {
    //   const shifted = e.shiftKey;
    //   return shifted;
    // });
    // if (shifted) {
    //   this.temp = "S";
    // }
    this.isRevealed = true;
    mineGrid.totalRevealed += 1;
    console.log(
      mineGrid.xDim * mineGrid.yDim -
        (mineGrid.totalRevealed + mineGrid.totalMines)
    );
    this.updateHTML();
    if (this.neighbourMineCount === 0) {
      this.revealAllNeighbours(mineGrid);
    }
  }

  revealAllNeighbours(mineGrid) {
    const xCoord = this.x;
    const yCoord = this.y;
    const differences = [-1, 0, 1];
    for (const dx of differences) {
      const xToCheck = xCoord + dx;
      if (xToCheck >= 0 && xToCheck < mineGrid.xDim) {
        for (const dy of differences) {
          const yToCheck = yCoord + dy;
          if (yToCheck >= 0 && yToCheck < mineGrid.yDim) {
            if (!mineGrid.grid[xToCheck][yToCheck].isRevealed) {
              mineGrid.grid[xToCheck][yToCheck].clicked(mineGrid);
            }
          }
        }
      }
    }
  }

  updateHTML() {
    document.getElementById(`square(${this.x},${this.y})`).classList +=
      " revealed";
  }
}

class minesweepingGrid {
  constructor(xDim, yDim, totalMines) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.grid = makeEmptyGrid(xDim, yDim);
    this.totalMines = totalMines;
    this.totalRevealed = 0;
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
    // should probably check there is a free space or smth, or get an array of coordinates which aren't mines mb

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
    this.countAllNeighbourhoods();
  }

  countAllNeighbourhoods() {
    for (let x = 0; x < this.xDim; x++) {
      for (let y = 0; y < this.yDim; y++) {
        this.grid[x][y].neighbourMineCount = this.countNeighbours(x, y);
      }
    }
  }

  countNeighbours(xCoord, yCoord) {
    let neighbourMines = 0;
    const differences = [-1, 0, 1];
    for (const dx of differences) {
      const xToCheck = xCoord + dx;
      if (xToCheck >= 0 && xToCheck < this.xDim) {
        for (const dy of differences) {
          const yToCheck = yCoord + dy;
          if (yToCheck >= 0 && yToCheck < this.yDim) {
            if (this.grid[xToCheck][yToCheck].isMine) {
              neighbourMines++;
            }
          }
        }
      }
    }
    return neighbourMines;
  }

  textVisualisationAll() {
    const visuals = [];
    for (const row of this.grid) {
      const viewedRow = [];
      for (const cell of row) {
        if (cell.isMine) viewedRow.push("X");
        else viewedRow.push(cell.neighbourMineCount);
      }
      visuals.push(viewedRow);
    }
    return visuals;
  }

  htmlVisualisationAll() {
    // minesweeper-main as a grid element
    const gridStrings = {
      start: `<div id="minesweeper-main" class="minesweeper-grid"
        style="grid-template-columns: ${columnRowLayout(this.yDim)};
        grid-template-rows: ${columnRowLayout(this.xDim)};"
      >`,
      end: "</div>",
    };
    document.getElementById("minesweeper-surrounding").innerHTML =
      gridStrings.start + gridStrings.end;

    // adding all the grid elements, including buttons interacting with mineGrid
    const stringsForGrid = [];
    for (const row of this.grid) {
      const stringsForRow = [];
      for (const square of row) {
        let classes = "minesweeper-square";
        if (square.isMine) classes += " boomer";
        let squareString = `<button class="${classes}" id="square(${square.x},${square.y})" onclick="mineGrid.grid[${square.x}][${square.y}].clicked(mineGrid)">`;
        if (square.isMine) {
          squareString += "X";
        } else {
          const neighboursNum = square.neighbourMineCount;
          squareString += neighboursNum === 0 ? "" : neighboursNum;
        }

        squareString += "</button>";

        stringsForRow.push(squareString);
      }
      stringsForGrid.push(stringsForRow.join(""));
    }
    document.getElementById("minesweeper-main").innerHTML =
      stringsForGrid.join("");
    // also show array:
  }
}
