# Digital Lock Keypad

This project simulates a digital lock keypad with a visual interface. Users can input a password using either mouse clicks or keyboard keys. The LEDs indicate whether the entered password is correct or incorrect.

🔗 [Try the Demo](https://davidyen1124.github.io/digital-keypad/)

![Digital Lock Keypad Interface](/screenshots/keypad.png)

## Features

- Visual keypad with clickable keys.
- Keyboard input support.
- Visual feedback using LEDs for correct and incorrect passwords.

## Setup

1. Clone the repository or download the project files.
2. Ensure you have a web browser installed.
3. Install [Node.js](https://nodejs.org/) so you can run a local web server.

## Usage

1. Start a local web server in the project directory, for example:

   ```bash
   npx http-server
   ```

2. Open the address printed by the server (e.g., `http://localhost:8080`) in your browser.
3. Use the on-screen keypad or your keyboard to enter the password. The green LED will light up if the password is correct, and the red LED will light up if the password is incorrect.

## Files

- `index.html`: The main HTML file containing the structure of the keypad.
- `styles.css`: The CSS file for styling the keypad and LEDs.
- `script.js`: The JavaScript file handling the keypad input and LED logic.

## Password

The correct password is set to `15964` by default. You can change this in the `script.js` file by modifying the `correctPassword` variable.

## License

This project is licensed under the "Not PearAI's" License - a satirical license poking fun at companies that fork repositories without adding value. See the [LICENSE](LICENSE) file for the full text and a good laugh.
