# 🧱 nodris

Terminal Tetris built with pure Node.js. No dependencies, no libraries — raw terminal, ANSI rendering, event-driven architecture.

## How it works

Input is handled as a Transform stream pipeline converting raw bytes into game events. Game state is immutable — every update is a pure function returning a new state. Rendering uses double buffering so only changed cells are written to stdout each frame, eliminating flicker. Colors use 256-color ANSI codes for consistent appearance across all supported terminals.

## Requirements

- Node.js 18+
- A terminal with 256-color support — GNOME Terminal, Kitty, Alacritty, iTerm2, Windows Terminal, PowerShell 7+

## Run

```bash
git clone https://github.com/vontanne/nodris.git
```

```bash
cd nodris
```

```bash
node index.js
```

## License

[MIT](LICENSE)
