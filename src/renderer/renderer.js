import {
  buildBuffer,
  createSentinelBuffer,
  BUFFER_ROWS,
  BUFFER_COLS,
} from "./bufferBuilder.js";
import { computeDiff } from "./diffEngine.js";
import { encodeChanges, CLEAR_SCREEN, HIDE_CURSOR, moveCursor } from "../ansi/ansi.js";

function createRenderer() {
  let previousBuffer = createSentinelBuffer();

  function init() {
    process.stdout.write(HIDE_CURSOR + CLEAR_SCREEN + moveCursor(1, 1));
  }

  function invalidate() {
    previousBuffer = createSentinelBuffer();
    process.stdout.write(CLEAR_SCREEN + moveCursor(1, 1));
  }

  function render(state) {
    const currentBuffer = buildBuffer(state);
    const changes = computeDiff(currentBuffer, previousBuffer);

    if (changes.length > 0) {
      process.stdout.write(
        encodeChanges(changes) + moveCursor(BUFFER_ROWS + 1, BUFFER_COLS + 1),
      );
    }

    previousBuffer = currentBuffer;
  }

  return { render, invalidate, init };
}

export { createRenderer };
