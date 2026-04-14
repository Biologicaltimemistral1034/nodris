import { GameEvents } from "../events/events.js";
import {
  createInitialState,
  applyEvent,
  computeDropInterval,
} from "../domain/game.js";

function createGameLoop(bus, renderer) {
  let state = createInitialState();
  let tickTimer = null;

  function scheduleNextTick() {
    if (tickTimer !== null) {
      clearInterval(tickTimer);
      tickTimer = null;
    }

    if (state.isGameOver || state.isPaused || state.isStartScreen) return;

    const interval = computeDropInterval(state.level);
    tickTimer = setInterval(() => dispatch(GameEvents.TICK), interval);
  }

  function dispatch(event) {
    const prevState = state;
    state = applyEvent(state, event);

    const levelChanged = state.level !== prevState.level;
    const pauseToggled = state.isPaused !== prevState.isPaused;
    const gameStarted = prevState.isStartScreen && !state.isStartScreen;
    const gameRestarted = prevState.isGameOver && !state.isGameOver;
    const gameOver = !prevState.isGameOver && state.isGameOver;

    if (gameOver) {
      clearInterval(tickTimer);
      tickTimer = null;
    }

    if (gameStarted || gameRestarted) {
      renderer.invalidate();
      scheduleNextTick();
    } else if (levelChanged || pauseToggled) {
      scheduleNextTick();
    }

    renderer.render(state);
    bus.emit(GameEvents.STATE_CHANGED, state);

    if (gameOver) {
      bus.emit(GameEvents.GAME_OVER, state);
    }
  }

  function wireInputEvents() {
    const inputEvents = [
      GameEvents.KEY_LEFT,
      GameEvents.KEY_RIGHT,
      GameEvents.KEY_DOWN,
      GameEvents.KEY_ROTATE,
      GameEvents.KEY_PAUSE,
      GameEvents.KEY_RESTART,
    ];

    for (const event of inputEvents) {
      bus.on(event, () => dispatch(event));
    }
  }

  function start() {
    renderer.init();
    wireInputEvents();
    renderer.render(state);
    scheduleNextTick();
  }

  function stop() {
    if (tickTimer !== null) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }

  return { start, stop };
}

export { createGameLoop };
