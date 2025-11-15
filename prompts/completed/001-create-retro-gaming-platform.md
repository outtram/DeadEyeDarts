<objective>
Create a retro 90's cyberpunk-themed web gaming platform that integrates with the existing darts-caller system. The platform will host multiple dart-based games with a modular architecture, starting with a zombie dart game. This needs to run locally on Mac and Windows computers, with each player running their own instance that connects to their local darts-caller server.

End goal: A visually appealing, easy-to-use gaming platform where players can throw real darts at their autodarts boards and play engaging mini-games with their friends.
</objective>

<context>
Current Setup:
- Existing darts-caller server runs at https://localhost:8079
- Provides WebSocket connection that broadcasts dart throw events
- DeadEyeDarts client already exists at @DeadEyeDarts/deadeyedarts_client.py
- Players use autodarts.io to play together online
- Each player runs software on their own computer (Mac or Windows)

Technical Context:
- Need simple, cross-platform solution (Python Flask + vanilla web tech)
- Players will run local web server to access games in browser
- Each player's instance is independent (no shared game state for v1)
- Must integrate with existing darts-caller WebSocket at https://localhost:8079
</context>

<requirements>
1. **Project Structure:**
   - Create modular folder structure: one folder per game
   - Central homepage that lists available games
   - Shared assets/libraries for common functionality
   - Easy to add new games in the future

2. **Homepage (Landing Page):**
   - Retro 90's cyberpunk aesthetic (think neon, grid lines, synthwave colors)
   - Game selection interface with visual cards/tiles for each game
   - Connection status indicator showing darts-caller connection
   - Responsive design that works on different screen sizes

3. **Game: Zombie Dart Slayer:**
   - 2 zombies displayed on screen
   - Each zombie randomly assigned a dartboard number (1-20)
   - Hit the correct number to kill that zombie
   - New zombie spawns with new random number when one is killed
   - Track: zombies killed, misses, score
   - 3 misses = game over
   - Visual feedback for hits/misses
   - Game over screen with stats and restart option
   - Retro/pixel art or ASCII-style graphics fitting the cyberpunk theme

4. **Technical Integration:**
   - Python Flask web server to serve the platform
   - WebSocket client connection to https://localhost:8079 (darts-caller)
   - Listen for dart throw events: 'dart1-thrown', 'dart2-thrown', 'dart3-thrown'
   - Parse dart data: segment number, multiplier, value
   - Real-time game updates based on dart throws
   - Handle SSL certificate verification (self-signed cert from darts-caller)

5. **User Experience:**
   - Simple startup script (like existing run_deadeyedarts.sh)
   - Browser automatically opens to homepage when server starts
   - Clear instructions on screen about connection status
   - Visual/audio feedback for game events
   - Easy navigation between homepage and games
</requirements>

<implementation>
Project Structure:
```
DeadEyeGames/
├── server.py                 # Flask web server
├── run_games.sh             # Startup script (Mac/Linux)
├── run_games.bat            # Startup script (Windows)
├── static/
│   ├── css/
│   │   └── cyberpunk.css    # Shared retro cyberpunk styles
│   ├── js/
│   │   └── darts-client.js  # Shared WebSocket connection handler
│   └── images/              # Shared images/assets
├── templates/
│   └── homepage.html        # Landing page with game selection
└── games/
    └── zombie-slayer/
        ├── zombie.html      # Game page
        ├── zombie.css       # Game-specific styles
        └── zombie.js        # Game logic
```

Technical Approach:
- Use Flask-SocketIO to bridge darts-caller WebSocket to web frontend
- Frontend connects to Flask server via Socket.IO
- Flask server connects to darts-caller at https://localhost:8079
- Forward dart events from darts-caller to connected web clients
- Keep it simple: vanilla JavaScript (no React/Vue for v1)
- Use CSS Grid/Flexbox for layout
- Retro aesthetic: Neon colors (#00ff00, #ff00ff, #00ffff), scanlines, CRT effects

Why These Constraints:
- Python Flask: Already familiar, works cross-platform, minimal setup
- Vanilla JS: Keeps dependencies simple, faster to prototype
- Socket.IO: Reliable WebSocket library with fallbacks
- Modular structure: Makes it easy to add games without touching existing code
- Self-signed cert handling: darts-caller uses HTTPS with self-signed certificate

What to Avoid and Why:
- Don't use heavy frontend frameworks (React/Vue) - adds complexity for simple games
- Don't try to sync game state between players yet - keep v1 simple, add later
- Don't modify existing darts-caller code - work with it as-is
- Don't use complex build systems - keep it runnable with simple script
</implementation>

<styling_guidelines>
Retro 90's Cyberpunk Aesthetic:
- **Color Palette:**
  - Primary: Neon cyan (#00ffff), neon magenta (#ff00ff), neon green (#00ff00)
  - Background: Dark (#0a0a0a, #1a1a2e)
  - Accents: Purple (#9d00ff), electric blue (#0080ff)
- **Typography:**
  - Headers: Bold, geometric fonts (or fallback to Impact, Arial Black)
  - Body: Monospace for that terminal feel (Courier New, Consolas)
  - Text shadow/glow effects on neon elements
- **Effects:**
  - Grid backgrounds with perspective
  - Scanline overlays (subtle)
  - Box shadows with neon glow
  - Subtle animations (pulsing, glowing)
  - Border: Thick neon outlines on key elements
- **Visual Elements:**
  - Geometric shapes
  - Grid lines
  - Retro computer terminal aesthetic
  - 8-bit or pixel art style for game sprites if applicable
</styling_guidelines>

<output>
Create the following files with relative paths from ~/CODE/:

1. `./DeadEyeGames/server.py` - Flask server with Socket.IO integration
2. `./DeadEyeGames/run_games.sh` - Startup script for Mac/Linux
3. `./DeadEyeGames/run_games.bat` - Startup script for Windows
4. `./DeadEyeGames/requirements.txt` - Python dependencies
5. `./DeadEyeGames/static/css/cyberpunk.css` - Shared retro cyberpunk styles
6. `./DeadEyeGames/static/js/darts-client.js` - WebSocket connection handler
7. `./DeadEyeGames/templates/homepage.html` - Game selection landing page
8. `./DeadEyeGames/games/zombie-slayer/zombie.html` - Zombie game page
9. `./DeadEyeGames/games/zombie-slayer/zombie.css` - Zombie game styles
10. `./DeadEyeGames/games/zombie-slayer/zombie.js` - Zombie game logic

Include comprehensive comments in all files explaining how each part works.
</output>

<game_logic_details>
Zombie Slayer Game Mechanics:
1. **Initialization:**
   - Spawn 2 zombies at game start
   - Each zombie gets random number (1-20)
   - Initialize: score=0, kills=0, misses=0

2. **Dart Throw Handling:**
   - Receive dart event with segment number
   - Check if segment matches any zombie's number
   - HIT: Kill zombie, spawn new one with new random number, increment score/kills
   - MISS: Increment miss counter, show visual feedback
   - If misses >= 3: Game Over

3. **Visual Feedback:**
   - Zombies pulse/glow when active
   - Hit: Zombie explodes/disappears with animation
   - Miss: Screen shake or red flash
   - Display current score, kills, misses prominently

4. **Game Over:**
   - Show final stats: Total Kills, Final Score
   - "Play Again" button to restart
   - Option to return to homepage

5. **Scoring:**
   - Base points per kill: 100
   - Bonus for multipliers (double/triple): 2x or 3x points
   - Display running score during gameplay
</game_logic_details>

<startup_experience>
The run_games.sh/.bat script should:
1. Check if virtual environment exists, create if not
2. Activate virtual environment
3. Install/verify dependencies (Flask, Flask-SocketIO, python-socketio[client])
4. Start Flask server on http://localhost:5000
5. Automatically open browser to http://localhost:5000
6. Display ASCII art banner with startup info
7. Show connection status to darts-caller

Similar experience to existing run_deadeyedarts.sh for consistency.
</startup_experience>

<verification>
Before declaring complete, verify your implementation:

1. **File Structure Check:**
   - All files created in correct locations
   - Folder structure follows specification
   - Files are properly organized and modular

2. **Technical Integration:**
   - Flask server can connect to darts-caller at https://localhost:8079
   - WebSocket events properly forwarded from darts-caller to web clients
   - SSL certificate verification handled correctly (disable for self-signed cert)
   - Dart throw events parsed correctly (segment, multiplier, value)

3. **Homepage Functionality:**
   - Cyberpunk styling renders correctly
   - Game selection works (links to zombie game)
   - Connection status indicator updates
   - Responsive layout works

4. **Zombie Game Functionality:**
   - 2 zombies display with random numbers
   - Dart hits correctly detected and matched
   - Zombies respawn with new numbers after kills
   - Miss counter increments correctly
   - Game over triggers at 3 misses
   - Score/stats display correctly
   - Restart functionality works

5. **Cross-Platform:**
   - Startup scripts work on Mac (test .sh)
   - Startup script provided for Windows (.bat)
   - No OS-specific dependencies

6. **Code Quality:**
   - Comprehensive comments explaining logic
   - Clean, readable code structure
   - Error handling for connection issues
   - Console logs for debugging
</verification>

<success_criteria>
The implementation is successful when:
- ✅ Player can run startup script and browser opens to cyberpunk homepage
- ✅ Homepage shows connection status to darts-caller
- ✅ Player can click "Zombie Slayer" to start game
- ✅ 2 zombies appear with dartboard numbers displayed clearly
- ✅ Throwing physical dart at board triggers hit/miss detection in real-time
- ✅ Hitting correct number kills zombie and spawns new one
- ✅ Missing 3 times shows game over screen with stats
- ✅ Visual aesthetic is clearly retro 90's cyberpunk themed
- ✅ Player can restart game or return to homepage easily
- ✅ Works on both Mac and Windows computers
</success_criteria>

<inspiration>
For reference, examine the existing DeadEyeDarts client to understand:
- How to connect to darts-caller WebSocket
- How dart events are structured
- SSL verification handling
@DeadEyeDarts/deadeyedarts_client.py

The new platform should provide a much richer visual experience while maintaining the same reliable dart detection.
</inspiration>
