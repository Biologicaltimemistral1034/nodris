import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildBuffer,
  createEmptyBuffer,
  createSentinelBuffer,
  BUFFER_ROWS,
  BUFFER_COLS,
} from "../../src/renderer/bufferBuilder.js";
import { createInitialState, applyEvent } from "../../src/domain/game.js";
import { GameEvents } from "../../src/events/events.js";

describe("createEmptyBuffer", () => {
  it("has correct dimensions", () => {
    const buf = createEmptyBuffer();
    assert.equal(buf.length, BUFFER_ROWS);
    assert.equal(buf[0].length, BUFFER_COLS);
  });

  it("all cells are empty (bg=0)", () => {
    const buf = createEmptyBuffer();
    assert.ok(buf.every((row) => row.every((cell) => cell.bg === 0)));
  });
});

describe("createSentinelBuffer", () => {
  it("all cells have sentinel bg value of -1", () => {
    const buf = createSentinelBuffer();
    assert.ok(buf.every((row) => row.every((cell) => cell.bg === -1)));
  });
});

describe("buildBuffer", () => {
  it("returns buffer with correct dimensions", () => {
    const state = createInitialState();
    const buf = buildBuffer(state);
    assert.equal(buf.length, BUFFER_ROWS);
    assert.equal(buf[0].length, BUFFER_COLS);
  });

  it("start screen buffer contains non-empty cells", () => {
    const state = createInitialState();
    const buf = buildBuffer(state);
    const anyFilled = buf.some((row) =>
      row.some((cell) => cell.char !== " " && cell.char !== "  "),
    );
    assert.ok(anyFilled, "start screen should have text cells");
  });

  it("game over buffer has text content", () => {
    let state = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    state = { ...state, isGameOver: true };
    const buf = buildBuffer(state);
    const anyText = buf.some((row) =>
      row.some((cell) => cell.char.trim() !== ""),
    );
    assert.ok(anyText);
  });

  it("gameplay buffer shows border characters", () => {
    let state = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    const buf = buildBuffer(state);
    const hasBorderChar = buf.some((row) =>
      row.some(
        (cell) => cell.char === "|" || cell.char === "-" || cell.char === "+",
      ),
    );
    assert.ok(hasBorderChar);
  });

  it("does not share references between successive builds", () => {
    let state = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    const buf1 = buildBuffer(state);
    state = applyEvent(state, GameEvents.TICK);
    const buf2 = buildBuffer(state);
    buf2[0][0].bg = 999;
    assert.notEqual(buf1[0][0].bg, 999);
  });
});
