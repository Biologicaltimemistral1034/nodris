import {
  checkColorSupport,
  enableRawMode,
  cleanup,
} from "./src/terminal/terminal.js";
import { EventBus } from "./src/events/eventBus.js";
import { GameEvents } from "./src/events/events.js";
import { KeyParser } from "./src/input/keyParser.js";
import { EventMapper } from "./src/input/eventMapper.js";
import { createRenderer } from "./src/renderer/renderer.js";
import { createGameLoop } from "./src/engine/gameLoop.js";

checkColorSupport();
enableRawMode();

const bus = new EventBus();
const renderer = createRenderer();
const loop = createGameLoop(bus, renderer);

const keyParser = new KeyParser();
const eventMapper = new EventMapper();

process.stdin.pipe(keyParser).pipe(eventMapper);

eventMapper.on("data", (event) => {
  if (event === GameEvents.KEY_QUIT) {
    shutdown(0);
    return;
  }
  bus.emit(event);
});

function shutdown(code = 0) {
  loop.stop();
  cleanup();
  process.exit(code);
}

process.on("exit", cleanup);
process.on("SIGINT", () => shutdown(0));
if (process.platform !== "win32") {
  process.on("SIGTERM", () => shutdown(0));
}
process.on("uncaughtException", (err) => {
  cleanup();
  console.error(`Uncaught error: ${err.message}\n${err.stack}`);
  process.exit(1);
});

loop.start();
