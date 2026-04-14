const TETROMINO_SHAPES = Object.freeze({
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [0, 0, 0],
    [2, 2, 2],
    [0, 0, 2],
  ],
  L: [
    [0, 0, 0],
    [3, 3, 3],
    [3, 0, 0],
  ],
  O: [
    [0, 0, 0, 0],
    [0, 4, 4, 0],
    [0, 4, 4, 0],
    [0, 0, 0, 0],
  ],
  S: [
    [0, 0, 0],
    [0, 5, 5],
    [5, 5, 0],
  ],
  T: [
    [0, 0, 0],
    [6, 6, 6],
    [0, 6, 0],
  ],
  Z: [
    [0, 0, 0],
    [7, 7, 0],
    [0, 7, 7],
  ],
});

const TETROMINO_TYPES = Object.freeze(["I", "J", "L", "O", "S", "T", "Z"]);

const PIECE_COLORS = Object.freeze({
  1: 51,
  2: 21,
  3: 208,
  4: 226,
  5: 46,
  6: 129,
  7: 196,
});

function cloneMatrix(matrix) {
  return matrix.map((row) => [...row]);
}

function rotateClockwise(matrix) {
  const size = matrix.length;
  const result = cloneMatrix(matrix);
  const maxIndex = size - 1;
  const centerX = Math.floor(size / 2);

  for (let i = 0; i < centerX; i++) {
    for (let j = i; j < maxIndex - i; j++) {
      const temp = result[i][j];
      result[i][j] = result[maxIndex - j][i];
      result[maxIndex - j][i] = result[maxIndex - i][maxIndex - j];
      result[maxIndex - i][maxIndex - j] = result[j][maxIndex - i];
      result[j][maxIndex - i] = temp;
    }
  }

  return result;
}

function rotateCounterClockwise(matrix) {
  const size = matrix.length;
  const result = cloneMatrix(matrix);
  const maxIndex = size - 1;
  const centerX = Math.floor(size / 2);

  for (let i = 0; i < centerX; i++) {
    for (let j = i; j < maxIndex - i; j++) {
      const temp = result[i][j];
      result[i][j] = result[j][maxIndex - i];
      result[j][maxIndex - i] = result[maxIndex - i][maxIndex - j];
      result[maxIndex - i][maxIndex - j] = result[maxIndex - j][i];
      result[maxIndex - j][i] = temp;
    }
  }

  return result;
}

function createRandomPiece(boardWidth) {
  const typeIndex = Math.floor(Math.random() * TETROMINO_TYPES.length);
  const type = TETROMINO_TYPES[typeIndex];
  const blocks = cloneMatrix(TETROMINO_SHAPES[type]);

  return {
    blocks,
    x: Math.floor((boardWidth - blocks[0].length) / 2),
    y: -1,
    colorIndex:
      blocks[1].find((v) => v > 0) ?? blocks[0].find((v) => v > 0) ?? 1,
  };
}

export {
  TETROMINO_SHAPES,
  TETROMINO_TYPES,
  PIECE_COLORS,
  cloneMatrix,
  rotateClockwise,
  rotateCounterClockwise,
  createRandomPiece,
};
