const CLEAR_SCREEN = "\x1b[2J";
const HIDE_CURSOR  = "\x1b[?25l";
const SHOW_CURSOR  = "\x1b[?25h";
const RESET_ATTRS  = "\x1b[0m";

function moveCursor(row, col) {
  return `\x1b[${row};${col}H`;
}

function encodeChanges(changes) {
  if (changes.length === 0) return "";

  const parts = [];

  for (const { row, col, bg, char } of changes) {
    parts.push(`\x1b[${row + 1};${col + 1}H`);
    if (bg > 0) {
      parts.push(`\x1b[48;5;${bg}m${char}\x1b[0m`);
    } else {
      parts.push(`\x1b[0m${char}`);
    }
  }

  return parts.join("");
}

export { CLEAR_SCREEN, HIDE_CURSOR, SHOW_CURSOR, RESET_ATTRS, moveCursor, encodeChanges };
