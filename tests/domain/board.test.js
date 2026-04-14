import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyBoard,
  hasCollision,
  lockPiece,
  clearCompleteLines,
  buildDisplayBoard,
  BOARD_HEIGHT,
  BOARD_WIDTH,
} from "../../src/domain/board.js";

function makePiece(blocks, x, y) {
  return { blocks, x, y, colorIndex: 1 };
}

describe("createEmptyBoard", () => {
  it("returns 20x10 grid of zeros", () => {
    const board = createEmptyBoard();
    assert.equal(board.length, BOARD_HEIGHT);
    assert.equal(board[0].length, BOARD_WIDTH);
    assert.ok(board.every((row) => row.every((cell) => cell === 0)));
  });
});

describe("hasCollision", () => {
  it("returns false for piece in empty space", () => {
    const board = createEmptyBoard();
    const piece = makePiece(
      [
        [1, 1],
        [1, 1],
      ],
      4,
      10,
    );
    assert.equal(hasCollision(board, piece), false);
  });

  it("returns true when piece hits bottom boundary", () => {
    const board = createEmptyBoard();
    const piece = makePiece([[1]], 0, BOARD_HEIGHT);
    assert.equal(hasCollision(board, piece), true);
  });

  it("returns true when piece hits left boundary", () => {
    const board = createEmptyBoard();
    const piece = makePiece([[1]], -1, 5);
    assert.equal(hasCollision(board, piece), true);
  });

  it("returns true when piece hits right boundary", () => {
    const board = createEmptyBoard();
    const piece = makePiece([[1]], BOARD_WIDTH, 5);
    assert.equal(hasCollision(board, piece), true);
  });

  it("returns true when piece overlaps settled cell", () => {
    const board = createEmptyBoard();
    board[10][5] = 3;
    const piece = makePiece([[1]], 5, 10);
    assert.equal(hasCollision(board, piece), true);
  });

  it("ignores cells above the board (y < 0)", () => {
    const board = createEmptyBoard();
    // A piece entirely above the board — no collision
    const piece = makePiece(
      [
        [1, 1],
        [0, 0],
      ],
      4,
      -2,
    );
    assert.equal(hasCollision(board, piece), false);
  });
});

describe("lockPiece", () => {
  it("does not mutate the input board", () => {
    const board = createEmptyBoard();
    const piece = makePiece([[1]], 5, 5);
    lockPiece(board, piece);
    assert.equal(board[5][5], 0);
  });

  it("returns a board with piece cells merged in", () => {
    const board = createEmptyBoard();
    const piece = makePiece([[2, 2]], 3, 7);
    const result = lockPiece(board, piece);
    assert.equal(result[7][3], 2);
    assert.equal(result[7][4], 2);
  });
});

describe("clearCompleteLines", () => {
  it("returns same board if no complete lines", () => {
    const board = createEmptyBoard();
    const { board: result, linesCleared } = clearCompleteLines(board);
    assert.equal(linesCleared, 0);
    assert.deepEqual(result, board);
  });

  it("clears one complete line and prepends an empty row", () => {
    const board = createEmptyBoard();
    board[19] = new Array(BOARD_WIDTH).fill(1);
    const { board: result, linesCleared } = clearCompleteLines(board);
    assert.equal(linesCleared, 1);
    assert.ok(result[0].every((c) => c === 0));
    assert.ok(result[19].every((c) => c === 0));
  });

  it("clears multiple complete lines", () => {
    const board = createEmptyBoard();
    board[18] = new Array(BOARD_WIDTH).fill(2);
    board[19] = new Array(BOARD_WIDTH).fill(3);
    const { board: result, linesCleared } = clearCompleteLines(board);
    assert.equal(linesCleared, 2);
    assert.ok(result[0].every((c) => c === 0));
    assert.ok(result[1].every((c) => c === 0));
  });

  it("does not mutate input board", () => {
    const board = createEmptyBoard();
    board[19] = new Array(BOARD_WIDTH).fill(1);
    const snap = JSON.stringify(board);
    clearCompleteLines(board);
    assert.equal(JSON.stringify(board), snap);
  });
});

describe("buildDisplayBoard", () => {
  it("overlays current piece onto the board", () => {
    const board = createEmptyBoard();
    const piece = makePiece([[5]], 3, 3);
    const display = buildDisplayBoard(board, piece);
    assert.equal(display[3][3], 5);
  });

  it("does not show piece rows that are above the board (y < 0)", () => {
    const board = createEmptyBoard();
    const piece = makePiece(
      [
        [0, 0],
        [1, 1],
      ],
      4,
      -1,
    );
    const display = buildDisplayBoard(board, piece);
    // Only row y=-1+1=0 is visible
    assert.equal(display[0][4], 1);
    assert.equal(display[0][5], 1);
  });

  it("does not mutate input board", () => {
    const board = createEmptyBoard();
    const piece = makePiece([[7]], 2, 2);
    buildDisplayBoard(board, piece);
    assert.equal(board[2][2], 0);
  });
});
