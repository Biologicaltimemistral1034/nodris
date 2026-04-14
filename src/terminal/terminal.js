import { SHOW_CURSOR, RESET_ATTRS } from "../ansi/ansi.js";

function checkColorSupport() {
  const colorDepth = process.stdout.getColorDepth();
  if (colorDepth < 8) {
    process.stdout.write(
      "nodris requires a terminal with 256-color support.\n",
    );
    process.stdout.write(
      "Please use Windows Terminal, PowerShell 7+, or any modern Linux/macOS terminal.\n",
    );
    process.exit(1);
  }
}

function enableRawMode() {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding(null);
}

let cleanupDone = false;

function cleanup() {
  if (cleanupDone) return;
  cleanupDone = true;

  try {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  } catch (_) {}

  process.stdout.write(RESET_ATTRS + SHOW_CURSOR + "\n");
}

export { checkColorSupport, enableRawMode, cleanup };
