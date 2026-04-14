import { Transform } from "stream";

const KeyNames = Object.freeze({
  LEFT: "left",
  RIGHT: "right",
  DOWN: "down",
  UP: "up",
  ENTER: "enter",
  SPACE: "space",
  P: "p",
  Q: "q",
  CTRL_C: "ctrl+c",
});

function parseKeyChunk(chunk) {
  if (chunk[0] === 0x1b && chunk[1] === 0x5b) {
    switch (chunk[2]) {
      case 0x44:
        return KeyNames.LEFT; // ESC [ D
      case 0x43:
        return KeyNames.RIGHT; // ESC [ C
      case 0x42:
        return KeyNames.DOWN; // ESC [ B
      case 0x41:
        return KeyNames.UP; // ESC [ A
    }
    return null;
  }

  if (chunk.length === 1) {
    const byte = chunk[0];
    if (byte === 0x0d || byte === 0x0a) return KeyNames.ENTER;
    if (byte === 0x20) return KeyNames.SPACE;
    if (byte === 0x03) return KeyNames.CTRL_C;
    if (byte === 0x70 || byte === 0x50) return KeyNames.P;
    if (byte === 0x71 || byte === 0x51) return KeyNames.Q;
  }

  return null;
}

class KeyParser extends Transform {
  constructor() {
    super({ readableObjectMode: true });
  }

  _transform(chunk, _encoding, callback) {
    const key = parseKeyChunk(chunk);
    if (key !== null) this.push(key);
    callback();
  }
}

export { KeyParser, KeyNames, parseKeyChunk };
