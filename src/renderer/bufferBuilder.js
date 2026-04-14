import { PIECE_COLORS } from "../domain/pieces.js";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  buildDisplayBoard,
} from "../domain/board.js";

const BOARD_ORIGIN_ROW = 2;
const BOARD_ORIGIN_COL = 3;
const PANEL_ORIGIN_ROW = 2;
const PANEL_ORIGIN_COL = 26;

const BUFFER_ROWS = 28;
const BUFFER_COLS = 50;

const SENTINEL_CELL = Object.freeze({ bg: -1, char: " " });
const EMPTY_CELL = Object.freeze({ bg: 0, char: " " });

function createEmptyBuffer() {
  return Array.from({ length: BUFFER_ROWS }, () =>
    Array.from({ length: BUFFER_COLS }, () => ({ ...EMPTY_CELL })),
  );
}

function createSentinelBuffer() {
  return Array.from({ length: BUFFER_ROWS }, () =>
    Array.from({ length: BUFFER_COLS }, () => ({ ...SENTINEL_CELL })),
  );
}

function writeText(buffer, bufRow, bufCol, text, bg = 0) {
  for (let i = 0; i < text.length; i++) {
    const col = bufCol + i;
    if (bufRow < 0 || bufRow >= BUFFER_ROWS) break;
    if (col < 0 || col >= BUFFER_COLS) break;
    buffer[bufRow][col] = { bg, char: text[i] };
  }
}

function renderBorder(buffer) {
  const top = BOARD_ORIGIN_ROW - 2;
  const bottom = BOARD_ORIGIN_ROW - 1 + BOARD_HEIGHT;
  const left = BOARD_ORIGIN_COL - 2;
  const right = BOARD_ORIGIN_COL - 1 + BOARD_WIDTH * 2;

  for (let col = left; col <= right; col++) {
    if (top >= 0 && top < BUFFER_ROWS) {
      buffer[top][col] = {
        bg: 0,
        char: col === left || col === right ? "+" : "-",
      };
    }
    if (bottom < BUFFER_ROWS) {
      buffer[bottom][col] = {
        bg: 0,
        char: col === left || col === right ? "+" : "-",
      };
    }
  }

  for (let row = top + 1; row < bottom; row++) {
    if (row < 0 || row >= BUFFER_ROWS) continue;
    if (left >= 0) buffer[row][left] = { bg: 0, char: "|" };
    if (right < BUFFER_COLS) buffer[row][right] = { bg: 0, char: "|" };
  }
}

function renderBoardCells(buffer, displayBoard) {
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      const colorIndex = displayBoard[row][col];
      const bufRow = BOARD_ORIGIN_ROW - 1 + row;
      const bufCol = BOARD_ORIGIN_COL - 1 + col * 2;

      if (colorIndex > 0) {
        const bg = PIECE_COLORS[colorIndex] ?? 0;
        buffer[bufRow][bufCol] = { bg, char: " " };
        buffer[bufRow][bufCol + 1] = { bg, char: " " };
      } else {
        buffer[bufRow][bufCol] = { ...EMPTY_CELL };
        buffer[bufRow][bufCol + 1] = { ...EMPTY_CELL };
      }
    }
  }
}

function renderPanel(buffer, state) {
  const r = PANEL_ORIGIN_ROW - 1;
  const c = PANEL_ORIGIN_COL - 1;

  writeText(buffer, r, c, `Score: ${state.score}`);
  writeText(buffer, r + 1, c, `Level: ${state.level}`);
  writeText(buffer, r + 2, c, `Lines: ${state.linesCleared}`);
  writeText(buffer, r + 4, c, "Next:");

  const { blocks } = state.nextPiece;
  for (let row = 0; row < blocks.length; row++) {
    for (let col = 0; col < blocks[row].length; col++) {
      const colorIndex = blocks[row][col];
      if (colorIndex > 0) {
        const bg = PIECE_COLORS[colorIndex] ?? 0;
        const bufRow = r + 5 + row;
        const bufCol = c + col * 2;
        if (bufRow < BUFFER_ROWS && bufCol + 1 < BUFFER_COLS) {
          buffer[bufRow][bufCol] = { bg, char: " " };
          buffer[bufRow][bufCol + 1] = { bg, char: " " };
        }
      }
    }
  }

  writeText(buffer, r + 11, c, "Controls:");
  writeText(buffer, r + 12, c, "\u2190\u2192  move");
  writeText(buffer, r + 13, c, "\u2191   rotate");
  writeText(buffer, r + 14, c, "\u2193   drop");
  writeText(buffer, r + 15, c, "P/Spc pause");
  writeText(buffer, r + 16, c, "Q   quit");
}

function renderStartScreen(buffer) {
  const midRow = Math.floor(BUFFER_ROWS / 2);
  const title = "N O D R I S";
  const sub = "Press Enter to start";
  writeText(
    buffer,
    midRow - 2,
    Math.floor((BUFFER_COLS - title.length) / 2),
    title,
  );
  writeText(buffer, midRow, Math.floor((BUFFER_COLS - sub.length) / 2), sub);
}

function renderPauseOverlay(buffer) {
  const midRow = Math.floor(BUFFER_ROWS / 2);
  const text = "--- PAUSED --- Press P to resume";
  writeText(buffer, midRow, Math.floor((BUFFER_COLS - text.length) / 2), text);
}

function renderGameOver(buffer, state) {
  const midRow = Math.floor(BUFFER_ROWS / 2);
  const line1 = "GAME OVER";
  const line2 = `Score: ${state.score}`;
  const line3 = "Press Enter to restart";
  writeText(
    buffer,
    midRow - 2,
    Math.floor((BUFFER_COLS - line1.length) / 2),
    line1,
  );
  writeText(
    buffer,
    midRow,
    Math.floor((BUFFER_COLS - line2.length) / 2),
    line2,
  );
  writeText(
    buffer,
    midRow + 2,
    Math.floor((BUFFER_COLS - line3.length) / 2),
    line3,
  );
}

function buildBuffer(state) {
  const buffer = createEmptyBuffer();

  if (state.isStartScreen) {
    renderStartScreen(buffer);
    return buffer;
  }

  if (state.isGameOver) {
    renderGameOver(buffer, state);
    return buffer;
  }

  const displayBoard = buildDisplayBoard(state.board, state.currentPiece);
  renderBorder(buffer);
  renderBoardCells(buffer, displayBoard);
  renderPanel(buffer, state);

  if (state.isPaused) {
    renderPauseOverlay(buffer);
  }

  return buffer;
}

export {
  buildBuffer,
  createEmptyBuffer,
  createSentinelBuffer,
  BUFFER_ROWS,
  BUFFER_COLS,
  BOARD_ORIGIN_ROW,
  BOARD_ORIGIN_COL,
  PANEL_ORIGIN_ROW,
  PANEL_ORIGIN_COL,
};
