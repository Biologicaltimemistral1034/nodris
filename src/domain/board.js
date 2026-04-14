const BOARD_HEIGHT = 20;
const BOARD_WIDTH = 10;

function createEmptyBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    new Array(BOARD_WIDTH).fill(0),
  );
}

function hasCollision(board, piece) {
  const { blocks, x: pieceX, y: pieceY } = piece;

  for (let row = 0; row < blocks.length; row++) {
    for (let col = 0; col < blocks[row].length; col++) {
      if (!blocks[row][col]) continue;

      const boardY = pieceY + row;
      const boardX = pieceX + col;

      if (boardY < 0) continue;

      const outOfBounds =
        boardY >= BOARD_HEIGHT || boardX < 0 || boardX >= BOARD_WIDTH;

      const occupied =
        board[boardY] !== undefined && board[boardY][boardX] !== 0;

      if (outOfBounds || occupied) return true;
    }
  }

  return false;
}

function lockPiece(board, piece) {
  const newBoard = board.map((row) => [...row]);
  const { blocks, x: pieceX, y: pieceY } = piece;

  for (let row = 0; row < blocks.length; row++) {
    for (let col = 0; col < blocks[row].length; col++) {
      if (blocks[row][col]) {
        newBoard[pieceY + row][pieceX + col] = blocks[row][col];
      }
    }
  }

  return newBoard;
}

function clearCompleteLines(board) {
  const completedIndices = [];

  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    const filledCells = board[row].filter((cell) => cell !== 0).length;

    if (filledCells === 0) break;
    if (filledCells === BOARD_WIDTH) completedIndices.unshift(row);
  }

  if (completedIndices.length === 0) {
    return { board, linesCleared: 0 };
  }

  const newBoard = board.map((row) => [...row]);

  for (const lineIndex of completedIndices) {
    newBoard.splice(lineIndex, 1);
    newBoard.unshift(new Array(BOARD_WIDTH).fill(0));
  }

  return { board: newBoard, linesCleared: completedIndices.length };
}

function buildDisplayBoard(board, piece) {
  const display = board.map((row) => [...row]);
  const { blocks, x: pieceX, y: pieceY } = piece;

  for (let row = 0; row < blocks.length; row++) {
    for (let col = 0; col < blocks[row].length; col++) {
      if (blocks[row][col]) {
        const boardY = pieceY + row;
        const boardX = pieceX + col;
        if (boardY >= 0 && boardY < BOARD_HEIGHT) {
          display[boardY][boardX] = blocks[row][col];
        }
      }
    }
  }

  return display;
}

export {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  createEmptyBoard,
  hasCollision,
  lockPiece,
  clearCompleteLines,
  buildDisplayBoard,
};
