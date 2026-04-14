import { EventEmitter } from "events";

class EventBus extends EventEmitter {
  emit(event, ...args) {
    return super.emit(event, ...args);
  }

  on(event, listener) {
    return super.on(event, listener);
  }
}

export { EventBus };
