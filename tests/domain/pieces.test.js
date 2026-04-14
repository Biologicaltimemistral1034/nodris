import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  rotateClockwise,
  rotateCounterClockwise,
  createRandomPiece,
  cloneMatrix,
  TETROMINO_SHAPES,
  PIECE_COLORS,
} from "../../src/domain/pieces.js";

describe("cloneMatrix", () => {
  it("returns a deep copy — mutations do not affect original", () => {
    const original = [
      [1, 2],
      [3, 4],
    ];
    const clone = cloneMatrix(original);
    clone[0][0] = 99;
    assert.equal(original[0][0], 1);
  });
});

describe("rotateClockwise", () => {
  it("rotates a 2x2 matrix correctly", () => {
    const m = [
      [1, 2],
      [3, 4],
    ];
    const result = rotateClockwise(m);
    assert.deepEqual(result, [
      [3, 1],
      [4, 2],
    ]);
  });

  it("does not mutate input", () => {
    const m = [
      [1, 2],
      [3, 4],
    ];
    rotateClockwise(m);
    assert.deepEqual(m, [
      [1, 2],
      [3, 4],
    ]);
  });

  it("4 clockwise rotations returns original", () => {
    const m = TETROMINO_SHAPES.T.map((r) => [...r]);
    let result = m;
    for (let i = 0; i < 4; i++) result = rotateClockwise(result);
    assert.deepEqual(result, m);
  });

  it("rotates a 3x3 matrix (T-piece) clockwise", () => {
    const t = [
      [0, 0, 0],
      [6, 6, 6],
      [0, 6, 0],
    ];
    const result = rotateClockwise(t);
    assert.deepEqual(result, [
      [0, 6, 0],
      [6, 6, 0],
      [0, 6, 0],
    ]);
  });
});

describe("rotateCounterClockwise", () => {
  it("is inverse of rotateClockwise", () => {
    const m = TETROMINO_SHAPES.S.map((r) => [...r]);
    const cw = rotateClockwise(m);
    const back = rotateCounterClockwise(cw);
    assert.deepEqual(back, m);
  });
});

describe("createRandomPiece", () => {
  it("returns a piece with valid shape", () => {
    const piece = createRandomPiece(10);
    assert.ok(Array.isArray(piece.blocks));
    assert.ok(piece.blocks.length >= 3);
    assert.ok(typeof piece.x === "number");
    assert.ok(typeof piece.y === "number");
  });

  it("centers the piece on the board", () => {
    for (let i = 0; i < 20; i++) {
      const piece = createRandomPiece(10);
      assert.ok(piece.x >= 0, `x=${piece.x} should be >= 0`);
      assert.ok(piece.x < 10, `x=${piece.x} should be < 10`);
    }
  });

  it("colorIndex is in valid range 1-7", () => {
    for (let i = 0; i < 30; i++) {
      const piece = createRandomPiece(10);
      assert.ok(piece.colorIndex >= 1 && piece.colorIndex <= 7);
    }
  });
});

describe("PIECE_COLORS", () => {
  it("has entries for all 7 color indices", () => {
    for (let i = 1; i <= 7; i++) {
      assert.ok(PIECE_COLORS[i] !== undefined, `Missing color for index ${i}`);
    }
  });
});
