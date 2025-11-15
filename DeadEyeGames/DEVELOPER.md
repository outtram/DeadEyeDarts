# DeadEyeGames Developer Guide

Guide for adding new games to the platform and customizing the experience.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Adding a New Game](#adding-a-new-game)
3. [Dart Event Handling](#dart-event-handling)
4. [Styling Guidelines](#styling-guidelines)
5. [Testing Your Game](#testing-your-game)
6. [Best Practices](#best-practices)

---

## Architecture Overview

### System Components

```
┌─────────────────┐     WebSocket      ┌──────────────┐     Socket.IO     ┌─────────────┐
│  Autodarts      │ ──────────────────> │    Flask     │ ─────────────────> │   Browser   │
│  darts-caller   │  HTTPS (8079)      │    Server    │   HTTP (5000)     │   Game UI   │
└─────────────────┘                     └──────────────┘                    └─────────────┘
```

### Data Flow

1. **Dart Throw**: Player throws dart at autodarts board
2. **Detection**: darts-caller detects throw and broadcasts event
3. **Forward**: Flask server receives event and forwards to all web clients
4. **Process**: Game JavaScript processes dart event and updates UI
5. **Display**: Player sees immediate visual feedback

### Tech Stack

- **Backend**: Python Flask + Flask-SocketIO
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Communication**: Socket.IO (WebSocket with fallbacks)
- **Styling**: Custom CSS with cyberpunk theme

---

## Adding a New Game

Follow these steps to add a new game to the platform:

### Step 1: Create Game Directory

```bash
mkdir games/your-game-name
cd games/your-game-name
```

### Step 2: Create Game Files

Create three files in your game directory:

#### `your-game.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Game - DeadEyeGames</title>

    <!-- Core styles and scripts -->
    <link rel="stylesheet" href="/static/css/cyberpunk.css">
    <link rel="stylesheet" href="/games/your-game-name/your-game.css">
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <script src="/static/js/darts-client.js"></script>
</head>
<body>
    <div class="game-container">
        <!-- Game header -->
        <div class="game-header">
            <a href="/" class="btn btn-secondary back-btn">← Back to Home</a>
            <div class="header-title">
                <h1>YOUR GAME TITLE</h1>
            </div>
            <div id="connection-status" class="status-indicator disconnected">
                <span class="status-dot"></span>
                <span class="status-text">Connecting...</span>
            </div>
        </div>

        <!-- Your game content here -->
        <div id="game-area">
            <!-- Game UI elements -->
        </div>
    </div>

    <!-- Your game logic -->
    <script src="/games/your-game-name/your-game.js"></script>

    <!-- Initialize dart connection -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            DartsClient.init({
                onDartThrown: function(dart) {
                    if (YourGame.isGameActive()) {
                        YourGame.handleDartThrow(dart);
                    }
                }
            });
        });
    </script>
</body>
</html>
```

#### `your-game.css`

```css
/**
 * Your Game - Specific Styles
 */

/* Game-specific layout */
.game-area {
    /* Your styles here */
}

/* Game-specific components */
.your-component {
    background: var(--bg-panel);
    border: 2px solid var(--neon-cyan);
    border-radius: 4px;
    padding: 2rem;
    box-shadow: 0 0 10px var(--neon-cyan);
}

/* Game-specific animations */
@keyframes yourAnimation {
    0% { /* start state */ }
    100% { /* end state */ }
}
```

#### `your-game.js`

```javascript
/**
 * Your Game - Game Logic
 */

const YourGame = (function() {
    // Private variables
    let gameActive = false;
    let score = 0;

    /**
     * Start a new game
     */
    function startGame() {
        console.log('YourGame: Starting...');
        gameActive = true;
        score = 0;
        // Initialize game state
    }

    /**
     * Handle dart throw from darts-caller
     * @param {Object} dart - Dart event data
     */
    function handleDartThrow(dart) {
        if (!gameActive) return;

        const segment = dart.segment;
        const multiplier = dart.multiplier;
        const value = dart.value;

        console.log(`YourGame: Dart thrown - ${segment} x${multiplier} = ${value}`);

        // Process dart throw in your game logic
        // Update score, check win conditions, etc.
    }

    /**
     * Check if game is active
     * @returns {boolean}
     */
    function isGameActive() {
        return gameActive;
    }

    /**
     * End the game
     */
    function endGame() {
        gameActive = false;
        // Show game over screen, etc.
    }

    // Public API
    return {
        startGame: startGame,
        handleDartThrow: handleDartThrow,
        isGameActive: isGameActive,
        endGame: endGame
    };
})();
```

### Step 3: Add Route to Server

Edit `server.py` and add a route for your game:

```python
@app.route('/games/your-game-name')
def your_game():
    """Serve your game page"""
    return render_template('your-game-name/your-game.html')
```

### Step 4: Add Game Card to Homepage

Edit `templates/homepage.html` and add your game card in the game grid:

```html
<a href="/games/your-game-name" class="game-card">
    <div class="game-icon">🎯</div>
    <h3>Your Game Name</h3>
    <p>
        Brief description of your game. Explain the objective
        and how to play in 2-3 sentences.
    </p>
    <div style="margin-top: 1rem;">
        <span class="btn btn-primary" style="pointer-events: none;">
            Play Now
        </span>
    </div>
</a>
```

### Step 5: Test Your Game

1. Restart the server (Ctrl+C and run startup script again)
2. Navigate to http://localhost:5000
3. Click on your game card
4. Test dart detection and game logic

---

## Dart Event Handling

### Event Structure

When a dart is thrown, you receive this data:

```javascript
{
    event: 'dart1-thrown',      // dart1/dart2/dart3-thrown
    segment: 20,                // Dartboard segment number (1-20, or 0 for bull)
    multiplier: 3,              // 1=single, 2=double, 3=triple
    value: 60,                  // Point value (segment × multiplier)
    dartNumber: 1,              // Which dart in round (1-3)
    player: 'Player Name'       // Player name from darts-caller
}
```

### Dartboard Numbers

Standard dartboard segments:

```
Numbers: 1-20 (arranged around the board)
Segment 0: Bullseye (center)
Segment 25: Outer bull (usually, but check darts-caller docs)
```

### Multipliers

```javascript
1 = Single (outer segments)
2 = Double (outer ring)
3 = Triple (middle ring)
```

### Common Patterns

#### Check for Specific Number

```javascript
if (dart.segment === 20) {
    // Player hit segment 20
}
```

#### Check for Triple

```javascript
if (dart.multiplier === 3) {
    // Player hit a triple
    bonusPoints = dart.value * 2;
}
```

#### Check for Bullseye

```javascript
if (dart.segment === 0 || dart.segment === 25) {
    // Player hit bullseye or outer bull
}
```

#### Track Round Progress

```javascript
if (dart.dartNumber === 3) {
    // Third dart of the round - end of turn
    processRoundComplete();
}
```

---

## Styling Guidelines

### Using Cyberpunk Theme Variables

The cyberpunk theme provides CSS variables for consistency:

```css
/* Colors */
var(--neon-cyan)          /* #00ffff - Primary accent */
var(--neon-magenta)       /* #ff00ff - Secondary accent */
var(--neon-green)         /* #00ff00 - Success/active */
var(--neon-purple)        /* #9d00ff - Borders */
var(--bg-dark)            /* #0a0a0a - Main background */
var(--bg-panel)           /* #1a1a2e - Panel background */
var(--text-primary)       /* #ffffff - Main text */
var(--text-secondary)     /* #cccccc - Secondary text */

/* Glow effects */
var(--glow-small)         /* 0 0 5px */
var(--glow-medium)        /* 0 0 10px */
var(--glow-large)         /* 0 0 20px */
```

### Creating Neon Elements

```css
.neon-element {
    color: var(--neon-cyan);
    border: 2px solid var(--neon-cyan);
    box-shadow: var(--glow-medium) var(--neon-cyan);
    text-shadow: var(--glow-small) var(--neon-cyan);
}

.neon-element:hover {
    box-shadow: var(--glow-large) var(--neon-cyan);
}
```

### Animations

Use smooth animations for game feedback:

```css
@keyframes scoreIncrease {
    0% {
        transform: scale(1);
        color: var(--neon-green);
    }
    50% {
        transform: scale(1.5);
        color: var(--neon-cyan);
        text-shadow: var(--glow-xlarge) var(--neon-cyan);
    }
    100% {
        transform: scale(1);
        color: var(--neon-green);
    }
}

.score-animate {
    animation: scoreIncrease 0.5s ease-out;
}
```

---

## Testing Your Game

### Manual Testing Checklist

- [ ] Game loads without console errors
- [ ] Connection status indicator works
- [ ] Start button is responsive
- [ ] Dart throws trigger game logic
- [ ] Score/stats update correctly
- [ ] Visual feedback is clear and immediate
- [ ] Game over condition works
- [ ] Restart functionality works
- [ ] Back button returns to homepage
- [ ] Responsive design works on different screen sizes

### Browser Console Testing

Press F12 to open developer console and check:

```javascript
// Test dart event manually
DartsClient.init({
    onDartThrown: function(dart) {
        console.log('Received dart:', dart);
    }
});

// Manually trigger dart for testing
socket.emit('dart_thrown', {
    segment: 20,
    multiplier: 3,
    value: 60,
    dartNumber: 1,
    player: 'Test'
});
```

### Testing Without Darts-Caller

Create a mock dart function for testing:

```javascript
function mockDartThrow(segment, multiplier) {
    const dart = {
        event: 'dart1-thrown',
        segment: segment,
        multiplier: multiplier,
        value: segment * multiplier,
        dartNumber: 1,
        player: 'Test Player'
    };
    YourGame.handleDartThrow(dart);
}

// Test in console
mockDartThrow(20, 3);  // Simulate triple 20
```

---

## Best Practices

### 1. Game State Management

Use a module pattern to encapsulate game state:

```javascript
const YourGame = (function() {
    // Private state
    let gameActive = false;
    let score = 0;

    // Private functions
    function privateHelper() {
        // Internal logic
    }

    // Public API
    return {
        startGame: function() { /* ... */ },
        handleDartThrow: function(dart) { /* ... */ }
    };
})();
```

### 2. Visual Feedback

Always provide immediate feedback for dart throws:

```javascript
function handleDartThrow(dart) {
    // Check hit/miss
    const isHit = checkHit(dart.segment);

    // Visual feedback
    if (isHit) {
        showMessage('HIT!', 'success');
        playHitAnimation();
    } else {
        showMessage('MISS!', 'error');
        playMissAnimation();
    }
}
```

### 3. Error Handling

Handle edge cases and connection issues:

```javascript
DartsClient.init({
    onDartThrown: function(dart) {
        try {
            if (YourGame.isGameActive()) {
                YourGame.handleDartThrow(dart);
            }
        } catch (error) {
            console.error('Error processing dart:', error);
            showErrorMessage('Game error! Please restart.');
        }
    },
    onDisconnected: function() {
        if (YourGame.isGameActive()) {
            YourGame.pauseGame();
            alert('Connection lost! Game paused.');
        }
    }
});
```

### 4. Performance

Keep animations smooth and efficient:

```javascript
// Good - Use CSS animations
element.classList.add('animate-hit');

// Avoid - JavaScript-heavy animations
function animateSlowly() {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            element.style.left = i + 'px';
        }, i * 10);
    }
}
```

### 5. Responsive Design

Test on different screen sizes:

```css
/* Mobile-first approach */
.game-element {
    font-size: 1rem;
    padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
    .game-element {
        font-size: 1.5rem;
        padding: 2rem;
    }
}
```

---

## Game Ideas for Inspiration

### Simple Games (Easy to implement)

1. **Target Practice**: Hit specific segments in sequence
2. **Speed Round**: Hit as many targets as possible in 60 seconds
3. **Number Hunt**: Hit all numbers 1-20 in any order
4. **Doubles Challenge**: Only double hits count

### Medium Complexity Games

1. **Around the Clock**: Hit 1-20 in order, then bullseye
2. **Points Race**: First to 1000 points wins
3. **Segment Bingo**: Random 3x3 grid of numbers to complete
4. **Zombie Waves**: Multiple zombies with increasing difficulty

### Advanced Games

1. **Boss Battle**: Large health pool, special attacks, phases
2. **Tower Defense**: Zombies advance, must hit to stop them
3. **Multiplayer Sync**: Real-time competition with other players
4. **Story Mode**: Multiple levels with cutscenes and progression

---

## Debugging Tips

### Common Issues

**Darts not detected:**
- Check `DartsClient.init()` is called
- Verify `onDartThrown` callback is set
- Check browser console for errors
- Ensure game is marked as active

**Styling broken:**
- Check CSS file path is correct
- Verify cyberpunk.css is loaded first
- Use browser inspector to check computed styles

**Game state issues:**
- Add console.log statements to track state changes
- Use browser debugger to step through code
- Check for typos in variable names

### Debug Mode

Enable verbose logging:

```javascript
const DEBUG = true;

function log(message, data) {
    if (DEBUG) {
        console.log(`[YourGame] ${message}`, data || '');
    }
}

// Use throughout your code
log('Dart received', dart);
log('Score updated', score);
```

---

## Publishing Your Game

Once your game is tested and working:

1. **Document**: Add game description to README.md
2. **Screenshots**: Take screenshots for documentation
3. **Test**: Have friends playtest for feedback
4. **Share**: Share your game with the community!

---

## Advanced Topics

### Custom Socket Events

Send custom events from game to server:

```javascript
// In your game JavaScript
socket.emit('game_event', {
    type: 'achievement_unlocked',
    achievement: 'first_kill'
});
```

```python
# In server.py
@web_socketio.on('game_event')
def handle_game_event(data):
    logger.info(f"Game event: {data}")
    # Process custom game events
```

### Persistent High Scores

Add local storage for high scores:

```javascript
function saveHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem('highScores') || '[]');
    highScores.push({
        game: 'YourGame',
        score: score,
        date: new Date().toISOString()
    });
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 10)));
}
```

---

## Resources

- **Flask Documentation**: https://flask.palletsprojects.com/
- **Socket.IO Documentation**: https://socket.io/docs/
- **darts-caller**: Check darts-caller docs for event format
- **CSS Tricks**: https://css-tricks.com/ for styling ideas

---

## Contributing

If you create an awesome game, consider:

1. Documenting your game thoroughly
2. Sharing code with clear comments
3. Creating a tutorial for others
4. Submitting your game to the community

---

**Happy Game Development!** 🎮🎯

Create something amazing and share it with the dart gaming community!
