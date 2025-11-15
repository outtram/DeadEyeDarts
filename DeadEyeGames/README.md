# DeadEyeGames 🎯🧟

**Retro 90's Cyberpunk Dart Gaming Platform**

A modular web-based gaming platform that integrates with your autodarts system via darts-caller. Play engaging mini-games by throwing real darts at your autodarts board!

## 🌟 Features

- **Retro Cyberpunk Aesthetic**: Neon colors, grid backgrounds, scanline effects, and CRT monitor vibes
- **Real Dart Integration**: Connects to darts-caller WebSocket for real-time dart throw detection
- **Modular Architecture**: Easy to add new games - each game in its own folder
- **Cross-Platform**: Runs on Mac and Windows with simple startup scripts
- **Zero Configuration**: Automatic virtual environment setup and dependency installation

## 🎮 Current Games

### Zombie Slayer 🧟
Kill zombies by hitting their assigned dartboard numbers! Each zombie has a random target (1-20). Hit it to eliminate the zombie and spawn a new one. Get bonus points for doubles and triples. Miss 3 times and it's game over!

**Scoring:**
- Single hit: 100 points
- Double hit: 200 points
- Triple hit: 300 points

## 📋 Requirements

- **Python 3.7+** (for Flask web server)
- **darts-caller** running at https://localhost:8079
- **autodarts board** for dart detection
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

### Mac/Linux

1. Make sure darts-caller is running
2. Open Terminal and navigate to DeadEyeGames folder
3. Run the startup script:
   ```bash
   ./run_games.sh
   ```
4. Browser will automatically open to http://localhost:5000
5. Select a game and start playing!

### Windows

1. Make sure darts-caller is running
2. Open Command Prompt and navigate to DeadEyeGames folder
3. Run the startup script:
   ```cmd
   run_games.bat
   ```
4. Browser will automatically open to http://localhost:5000
5. Select a game and start playing!

## 🏗️ Project Structure

```
DeadEyeGames/
├── server.py                 # Flask web server with Socket.IO
├── run_games.sh             # Startup script (Mac/Linux)
├── run_games.bat            # Startup script (Windows)
├── requirements.txt         # Python dependencies
├── static/
│   ├── css/
│   │   └── cyberpunk.css    # Shared retro cyberpunk styles
│   ├── js/
│   │   └── darts-client.js  # WebSocket connection handler
│   └── images/              # Shared images/assets
├── templates/
│   └── homepage.html        # Landing page with game selection
└── games/
    └── zombie-slayer/
        ├── zombie.html      # Game page
        ├── zombie.css       # Game-specific styles
        └── zombie.js        # Game logic
```

## 🔧 Technical Details

### Architecture

- **Flask**: Lightweight Python web framework serving HTML/CSS/JS
- **Flask-SocketIO**: Real-time WebSocket communication with browser
- **python-socketio**: Client connection to darts-caller WebSocket
- **Vanilla JavaScript**: No heavy frameworks - keeps it simple and fast

### How It Works

1. Flask server starts and connects to darts-caller at https://localhost:8079
2. Server listens for dart throw events: `dart1-thrown`, `dart2-thrown`, `dart3-thrown`
3. Server forwards dart events to all connected web browser clients via Socket.IO
4. Each game page connects to Flask server and receives dart events in real-time
5. Game logic processes dart throws and updates UI accordingly

### Data Flow

```
Autodarts Board → darts-caller → Flask Server → Web Browser → Game Logic
```

## 🎨 Styling Guidelines

The platform uses a retro 90's cyberpunk aesthetic:

**Color Palette:**
- Neon cyan (#00ffff)
- Neon magenta (#ff00ff)
- Neon green (#00ff00)
- Dark backgrounds (#0a0a0a, #1a1a2e)

**Effects:**
- Animated grid backgrounds
- Scanline overlays (CRT monitor effect)
- Neon glow on interactive elements
- Geometric shapes and borders
- Smooth animations and transitions

## 🆕 Adding New Games

The modular structure makes it easy to add new games:

1. Create a new folder in `games/` (e.g., `games/target-practice/`)
2. Add game files:
   - `[game].html` - Game page structure
   - `[game].css` - Game-specific styles
   - `[game].js` - Game logic
3. Add route in `server.py`:
   ```python
   @app.route('/games/target-practice')
   def target_practice():
       return render_template('target-practice/game.html')
   ```
4. Add game card to `templates/homepage.html`
5. Implement game logic using `DartsClient.handleDartThrown()` callback

## 🐛 Troubleshooting

### Connection Status Shows "Disconnected"
- Ensure darts-caller is running at https://localhost:8079
- Check that no firewall is blocking local connections
- Try restarting both darts-caller and DeadEyeGames

### Browser Doesn't Open Automatically
- Manually navigate to http://localhost:5000
- Check if another application is using port 5000

### Dart Throws Not Detected
- Verify darts-caller connection status is "Connected" (green indicator)
- Test dart detection in darts-caller directly
- Check browser console for error messages (F12 → Console)

### Virtual Environment Issues
- Delete the `venv` folder and run startup script again
- Ensure Python 3.7+ is installed: `python3 --version`

## 📝 Dependencies

All dependencies are automatically installed by the startup scripts:

- **Flask 3.0.0**: Web framework
- **Flask-SocketIO 5.3.5**: WebSocket support for Flask
- **python-socketio[client] 5.10.0**: Client connection to darts-caller
- **eventlet 0.33.3**: Async/event-driven server

## 🎯 Dart Event Format

Games receive dart events in this format:

```javascript
{
    event: 'dart1-thrown',      // dart1/dart2/dart3-thrown
    segment: 20,                // Dartboard number (1-20, or 0 for bull)
    multiplier: 3,              // 1=single, 2=double, 3=triple
    value: 60,                  // Point value (segment × multiplier)
    dartNumber: 1,              // Which dart in the round (1-3)
    player: 'Player Name'       // Player name from darts-caller
}
```

## 📜 License

This project is created for personal use with autodarts systems. Feel free to modify and extend for your own dart gaming needs!

## 🙏 Credits

- Built for integration with [autodarts.io](https://autodarts.io)
- Uses darts-caller for dart detection
- Inspired by retro 90's cyberpunk aesthetics

## 🚧 Future Game Ideas

- **Target Practice**: Hit specific segments in sequence
- **Speed Round**: Hit as many targets as possible in 60 seconds
- **Around the Clock**: Hit numbers 1-20 in order
- **High Score Challenge**: Maximize points in 9 darts
- **Multiplier Madness**: Only doubles and triples count!

---

**Ready to play? Run the startup script and let the games begin!** 🎯✨
