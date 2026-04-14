import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeDiff } from "../../src/renderer/diffEngine.js";

function makeBuffer(rows, cols, bg = 0, char = " ") {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ bg, char })),
  );
}

describe("computeDiff", () => {
  it("returns no changes when buffers are identical", () => {
    const buf = makeBuffer(3, 3);
    const changes = computeDiff(buf, buf);
    assert.equal(changes.length, 0);
  });

  it("returns all cells when previous is sentinel (-1 bg)", () => {
    const current = makeBuffer(2, 2);
    const previous = makeBuffer(2, 2, -1);
    const changes = computeDiff(current, previous);
    assert.equal(changes.length, 4);
  });

  it("returns only changed cells", () => {
    const current = makeBuffer(2, 2);
    const previous = makeBuffer(2, 2);
    current[1][1] = { bg: 51, char: " " };
    const changes = computeDiff(current, previous);
    assert.equal(changes.length, 1);
    assert.equal(changes[0].row, 1);
    assert.equal(changes[0].col, 1);
    assert.equal(changes[0].bg, 51);
  });

  it("change includes correct row/col/bg/char", () => {
    const current = makeBuffer(1, 1);
    const previous = makeBuffer(1, 1, -1);
    current[0][0] = { bg: 196, char: "X" };
    const [change] = computeDiff(current, previous);
    assert.equal(change.row, 0);
    assert.equal(change.col, 0);
    assert.equal(change.bg, 196);
    assert.equal(change.char, "X");
  });

  it("handles previous buffer with fewer rows gracefully", () => {
    const current = makeBuffer(3, 3);
    const previous = makeBuffer(2, 3);
    const changes = computeDiff(current, previous);
    const row2Changes = changes.filter((c) => c.row === 2);
    assert.equal(row2Changes.length, 3);
  });

  it("detects char-only changes", () => {
    const current = makeBuffer(1, 1);
    const previous = makeBuffer(1, 1);
    current[0][0] = { bg: 0, char: "A" };
    previous[0][0] = { bg: 0, char: "B" };
    const changes = computeDiff(current, previous);
    assert.equal(changes.length, 1);
  });
});
