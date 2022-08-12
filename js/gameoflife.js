function seed() {
  return [...arguments]
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.find(cellElement => {
    for (let i = 0; i < cellElement.length; ++i) {
      if (cellElement[i] !== cell[i]) return false;
    };
    return true;
  });
}

const printCell = (cell, state) => {
  if (contains.call(state, cell)) return '\u25A3'
  return '\u25A2'
};

const corners = (state = []) => {
  let topRight = new Array();
  let bottomLeft = new Array();

  if (state.length === 0) {
    topRight = [0, 0];
    bottomLeft = [0, 0];
    return { topRight, bottomLeft }
  }
  if (state.length === 1) {
    topRight = state[0];
    bottomLeft = state[0];
    return { topRight, bottomLeft }
  }

  state.forEach(cellElement => {
    if (!topRight[0] || cellElement[0] > topRight[0]) topRight[0] = cellElement[0];
    if (!topRight[1] || cellElement[1] > topRight[1]) topRight[1] = cellElement[1];
    if (!bottomLeft[0] || cellElement[0] < bottomLeft[0]) bottomLeft[0] = cellElement[0];
    if (!bottomLeft[1] || cellElement[1] < bottomLeft[1]) bottomLeft[1] = cellElement[1];
  })
  return { topRight, bottomLeft }
};

const printCells = (state) => {
  let output = "";

  if (state.length === 0) {
    return output;
  }
  if (state.length === 1) {
    output += printCell(state[0], state)
    return output;
  };

  const cornersOfGivenState = corners(state);
  for (let lineIndex = cornersOfGivenState.topRight[1]; lineIndex >= cornersOfGivenState.bottomLeft[1]; lineIndex--) {
    for (let columnIndex = cornersOfGivenState.bottomLeft[0]; columnIndex <= cornersOfGivenState.topRight[0]; columnIndex++) {
      output += (printCell([columnIndex, lineIndex], state))
      output += columnIndex === cornersOfGivenState.topRight[0] ? "\n" : " ";
    };
  }
  return output;
};

const getNeighborsOf = ([x, y]) => {
  return [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]]
};

const getLivingNeighbors = (cell, state) => {
  const livingNeighbors = new Array();
  const stateContains = contains.bind(state);
  getNeighborsOf(cell).forEach(neighbor => {
    if (stateContains(neighbor)) livingNeighbors.push(neighbor);
  });
  return livingNeighbors;
};

const willBeAlive = (cell, state) => {
  const numberOfLivingNeighbors = getLivingNeighbors(cell, state).length;
  if (numberOfLivingNeighbors === 3) return true;
  if (numberOfLivingNeighbors === 2 && contains.call(state, cell)) return true;
  return false;
};

const calculateNext = (state) => {
  const currentCorners = corners(state);
  const nextPotentialTopRight = [currentCorners.topRight[0] + 1, currentCorners.topRight[1] + 1]
  const nextPotentialBottomLeft = [currentCorners.bottomLeft[0] - 1, currentCorners.bottomLeft[1] - 1]

  const newState = new Array();
  if (state.length < 3) {
    return newState;
  };
  for (let lineIndex = nextPotentialBottomLeft[1]; lineIndex <= nextPotentialTopRight[1]; lineIndex++) {
    for (let columnIndex = nextPotentialBottomLeft[0]; columnIndex < nextPotentialTopRight[0]; columnIndex++) {
      const currentCell = [columnIndex, lineIndex];
      if (willBeAlive(currentCell, state)) newState.push(currentCell);
    };
  };
  return newState;
};

const iterate = (state, iterations) => {
  stateIterations = new Array();
  stateIterations.push(state);
  for (let index = 0; index < iterations; index++) {
    state = calculateNext(state);
    stateIterations.push(state);
  };
  return stateIterations;
};

const main = (pattern, iterations) => {
  const patternIterations = iterate(startPatterns[pattern], iterations);
  for (let element of patternIterations) {
    console.log(`${printCells(element)}\n`);
  }
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;