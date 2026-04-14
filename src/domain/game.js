import { GameEvents } from "../events/events.js";
import { createRandomPiece, rotateClockwise } from "./pieces.js";
import {
  BOARD_WIDTH,
  createEmptyBoard,
  hasCollision,
  lockPiece,
  clearCompleteLines,
} from "./board.js";

const LINES_PER_LEVEL = 25;
const INITIAL_SPEED_MS = 1000;
const MIN_SPEED_MS = 100;
const SPEED_DECREASE_PER_LEVEL = 100;

const POINTS_PER_LINES = Object.freeze({
  1: 10,
  2: 30,
  3: 90,
  4: 270,
});

function computeDropInterval(level) {
  return Math.max(
    INITIAL_SPEED_MS - level * SPEED_DECREASE_PER_LEVEL,
    MIN_SPEED_MS,
  );
}

function computeLevel(linesCleared) {
  return Math.floor(linesCleared / LINES_PER_LEVEL);
}

function computeScoreDelta(linesCleared, level) {
  if (linesCleared <= 0) return 0;
  return (POINTS_PER_LINES[linesCleared] ?? 0) * (level + 1);
}

function createInitialState() {
  return {
    board: createEmptyBoard(),
    currentPiece: createRandomPiece(BOARD_WIDTH),
    nextPiece: createRandomPiece(BOARD_WIDTH),
    score: 0,
    level: 0,
    linesCleared: 0,
    isPaused: false,
    isGameOver: false,
    isStartScreen: true,
  };
}

function tryMove(state, dx, dy) {
  const moved = {
    ...state.currentPiece,
    x: state.currentPiece.x + dx,
    y: state.currentPiece.y + dy,
  };
  if (hasCollision(state.board, moved)) return state;
  return { ...state, currentPiece: moved };
}

function lockAndSpawn(state) {
  const boardAfterLock = lockPiece(state.board, state.currentPiece);
  const { board: boardAfterClear, linesCleared: newLines } =
    clearCompleteLines(boardAfterLock);

  const totalLines = state.linesCleared + newLines;
  const level = computeLevel(totalLines);
  const score = state.score + computeScoreDelta(newLines, level);

  const currentPiece = state.nextPiece;
  const nextPiece = createRandomPiece(BOARD_WIDTH);
  const isGameOver = hasCollision(boardAfterClear, currentPiece);

  return {
    ...state,
    board: boardAfterClear,
    currentPiece,
    nextPiece,
    score,
    level,
    linesCleared: totalLines,
    isGameOver,
  };
}

function applyTick(state) {
  const moved = { ...state.currentPiece, y: state.currentPiece.y + 1 };
  if (!hasCollision(state.board, moved)) {
    return { ...state, currentPiece: moved };
  }
  return lockAndSpawn(state);
}

function applyEvent(state, event) {
  if (state.isStartScreen) {
    if (event === GameEvents.KEY_RESTART) {
      return { ...state, isStartScreen: false };
    }
    return state;
  }

  if (state.isGameOver) {
    if (event === GameEvents.KEY_RESTART) {
      return { ...createInitialState(), isStartScreen: false };
    }
    return state;
  }

  if (event === GameEvents.KEY_PAUSE) {
    return { ...state, isPaused: !state.isPaused };
  }

  if (state.isPaused) return state;

  switch (event) {
    case GameEvents.TICK:
      return applyTick(state);
    case GameEvents.KEY_LEFT:
      return tryMove(state, -1, 0);
    case GameEvents.KEY_RIGHT:
      return tryMove(state, 1, 0);
    case GameEvents.KEY_DOWN:
      return applyTick(state);
    case GameEvents.KEY_ROTATE: {
      const rotated = {
        ...state.currentPiece,
        blocks: rotateClockwise(state.currentPiece.blocks),
      };
      if (hasCollision(state.board, rotated)) return state;
      return { ...state, currentPiece: rotated };
    }
    default:
      return state;
  }
}

export {
  createInitialState,
  applyEvent,
  computeDropInterval,
  LINES_PER_LEVEL,
  INITIAL_SPEED_MS,
  MIN_SPEED_MS,
  SPEED_DECREASE_PER_LEVEL,
};
