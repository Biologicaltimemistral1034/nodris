function computeDiff(current, previous) {
  const changes = [];

  for (let row = 0; row < current.length; row++) {
    for (let col = 0; col < current[row].length; col++) {
      const curr = current[row][col];
      const prev = previous[row]?.[col];

      if (
        prev === undefined ||
        prev.bg === -1 ||
        curr.bg !== prev.bg ||
        curr.char !== prev.char
      ) {
        changes.push({ row, col, bg: curr.bg, char: curr.char });
      }
    }
  }

  return changes;
}

export { computeDiff };
