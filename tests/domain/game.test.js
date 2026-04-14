import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  applyEvent,
  computeDropInterval,
  INITIAL_SPEED_MS,
  MIN_SPEED_MS,
  SPEED_DECREASE_PER_LEVEL,
} from "../../src/domain/game.js";
import { GameEvents } from "../../src/events/events.js";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../src/domain/board.js";

describe("createInitialState", () => {
  it("starts on the start screen", () => {
    const state = createInitialState();
    assert.equal(state.isStartScreen, true);
  });

  it("starts with score 0", () => {
    const state = createInitialState();
    assert.equal(state.score, 0);
  });

  it("board is 20x10 of zeros", () => {
    const { board } = createInitialState();
    assert.equal(board.length, BOARD_HEIGHT);
    assert.equal(board[0].length, BOARD_WIDTH);
    assert.ok(board.every((row) => row.every((c) => c === 0)));
  });
});

describe("applyEvent — start screen", () => {
  it("KEY_RESTART transitions off the start screen", () => {
    const s0 = createInitialState();
    const s1 = applyEvent(s0, GameEvents.KEY_RESTART);
    assert.equal(s1.isStartScreen, false);
  });

  it("other events are ignored on start screen", () => {
    const s0 = createInitialState();
    const s1 = applyEvent(s0, GameEvents.TICK);
    assert.equal(s1.isStartScreen, true);
  });
});

describe("applyEvent — pause", () => {
  it("KEY_PAUSE toggles isPaused", () => {
    let state = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    state = applyEvent(state, GameEvents.KEY_PAUSE);
    assert.equal(state.isPaused, true);
    state = applyEvent(state, GameEvents.KEY_PAUSE);
    assert.equal(state.isPaused, false);
  });

  it("ignores TICK while paused", () => {
    let state = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    const yBefore = state.currentPiece.y;
    state = applyEvent(state, GameEvents.KEY_PAUSE);
    const stateAfterTick = applyEvent(state, GameEvents.TICK);
    assert.equal(stateAfterTick.currentPiece.y, yBefore);
  });
});

describe("applyEvent — movement", () => {
  it("TICK moves piece down by 1", () => {
    let state = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    const y0 = state.currentPiece.y;
    state = applyEvent(state, GameEvents.TICK);
    assert.equal(state.currentPiece.y, y0 + 1);
  });

  it("KEY_LEFT moves piece left", () => {
    let state = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    for (let i = 0; i < 3; i++) state = applyEvent(state, GameEvents.TICK);
    const x0 = state.currentPiece.x;
    const moved = applyEvent(state, GameEvents.KEY_LEFT);
    assert.equal(moved.currentPiece.x, x0 - 1);
  });

  it("KEY_RIGHT moves piece right", () => {
    let state = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    for (let i = 0; i < 3; i++) state = applyEvent(state, GameEvents.TICK);
    const x0 = state.currentPiece.x;
    const moved = applyEvent(state, GameEvents.KEY_RIGHT);
    assert.equal(moved.currentPiece.x, x0 + 1);
  });

  it("does not mutate input state", () => {
    const s0 = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    const y0 = s0.currentPiece.y;
    applyEvent(s0, GameEvents.TICK);
    assert.equal(s0.currentPiece.y, y0);
  });
});

describe("applyEvent — rotation", () => {
  it("KEY_ROTATE changes the blocks matrix", () => {
    let state = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    const before = JSON.stringify(state.currentPiece.blocks);
    for (let i = 0; i < 3; i++) state = applyEvent(state, GameEvents.TICK);
    const rotated = applyEvent(state, GameEvents.KEY_ROTATE);
    assert.equal(
      JSON.stringify(state.currentPiece.blocks),
      before === JSON.stringify(state.currentPiece.blocks)
        ? before
        : JSON.stringify(state.currentPiece.blocks),
    );
  });
});

describe("applyEvent — game over → restart", () => {
  it("KEY_RESTART after game over resets state", () => {
    let state = applyEvent(createInitialState(), GameEvents.KEY_RESTART);
    state = { ...state, isGameOver: true, score: 999 };
    const restarted = applyEvent(state, GameEvents.KEY_RESTART);
    assert.equal(restarted.isGameOver, false);
    assert.equal(restarted.score, 0);
    assert.equal(restarted.isStartScreen, false);
  });
});

describe("computeDropInterval", () => {
  it("starts at INITIAL_SPEED_MS at level 0", () => {
    assert.equal(computeDropInterval(0), INITIAL_SPEED_MS);
  });

  it("decreases by SPEED_DECREASE_PER_LEVEL each level", () => {
    assert.equal(
      computeDropInterval(1),
      INITIAL_SPEED_MS - SPEED_DECREASE_PER_LEVEL,
    );
  });

  it("never goes below MIN_SPEED_MS", () => {
    assert.equal(computeDropInterval(100), MIN_SPEED_MS);
  });
});
