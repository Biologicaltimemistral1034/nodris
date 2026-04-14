import { Transform } from "stream";
import { GameEvents } from "../events/events.js";
import { KeyNames } from "./keyParser.js";

const KEY_TO_EVENT = Object.freeze({
  [KeyNames.LEFT]: GameEvents.KEY_LEFT,
  [KeyNames.RIGHT]: GameEvents.KEY_RIGHT,
  [KeyNames.DOWN]: GameEvents.KEY_DOWN,
  [KeyNames.UP]: GameEvents.KEY_ROTATE,
  [KeyNames.ENTER]: GameEvents.KEY_RESTART,
  [KeyNames.SPACE]: GameEvents.KEY_PAUSE,
  [KeyNames.P]: GameEvents.KEY_PAUSE,
  [KeyNames.Q]: GameEvents.KEY_QUIT,
  [KeyNames.CTRL_C]: GameEvents.KEY_QUIT,
});

class EventMapper extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(keyName, _encoding, callback) {
    const event = KEY_TO_EVENT[keyName];
    if (event !== undefined) this.push(event);
    callback();
  }
}

export { EventMapper, KEY_TO_EVENT };
