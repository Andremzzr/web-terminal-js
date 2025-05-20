# 🐧 Linux Terminal Emulator (Web)

This is a simple Linux-style terminal emulator built using **HTML**, **CSS**, and **JavaScript**. It runs entirely in the browser with no backend and mimics basic terminal behavior like `mkdir`, `cd`, `ls`, and `clear`.

## Project Structure

```
├── index.html # Contains the basic terminal layout
├── style.css # Styles for the terminal interface
└── main.js # All the logic for handling commands and directory structure
```

## Features

- `mkdir <folder>`: Creates a new folder in the current directory.
- `cd <folder>`: Navigates into a folder. Supports `..` to go up one level and `.` for current directory.
- `ls`: Lists folders in the current directory.
- `clear`: Clears all output from the terminal.
- `help`: Displays a list of available commands.
- **Command History**: Navigate through previously entered commands using the up and down arrow keys.

## Getting Started

1. Clone or download the repository.
2. Open `index.html` in any modern web browser.
3. Start typing commands in the simulated terminal prompt.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript

## Notes

- The filesystem is simulated with JavaScript objects and resets on page refresh.
- All commands and file structure logic are handled in `main.js`.
- Command history is maintained during the session and can be accessed with the up/down arrow keys.