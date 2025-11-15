/**
 * Zombie Slayer Game Logic
 *
 * Game Mechanics:
 * - 1 zombie on screen at a time
 * - Zombie has a random target number (1-20)
 * - Hit the correct number to kill the zombie
 * - Zombie respawns with new random number
 * - Score points for each kill (100 base, multiplied by dart multiplier)
 * - 3 misses = Game Over
 *
 * Scoring:
 * - Single hit: 100 points
 * - Double hit: 200 points
 * - Triple hit: 300 points
 */

const ZombieGame = (function() {
    // Game state
    let gameActive = false;
    let score = 0;
    let kills = 0;
    let misses = 0;
    const MAX_MISSES = 3;

    // Zombie target (only 1 zombie now)
    let zombieTarget = 0;

    // DOM elements
    let scoreElement, killsElement, missesElement;
    let targetElement;
    let zombieElement;
    let gameArea, instructionsPanel, gameOverScreen;
    let gameMessage;

    /**
     * Initialize game elements on page load
     */
    function initElements() {
        scoreElement = document.getElementById('score');
        killsElement = document.getElementById('kills');
        missesElement = document.getElementById('misses');
        targetElement = document.getElementById('target1');
        zombieElement = document.getElementById('zombie1');
        gameArea = document.getElementById('game-area');
        instructionsPanel = document.getElementById('instructions');
        gameOverScreen = document.getElementById('game-over');
        gameMessage = document.getElementById('game-message');

        // Hide second zombie
        const zombie2Element = document.getElementById('zombie2');
        if (zombie2Element) {
            zombie2Element.style.display = 'none';
        }
    }

    /**
     * Generate random dartboard number (1-20)
     * @returns {number} Random number between 1 and 20
     */
    function randomDartNumber() {
        return Math.floor(Math.random() * 20) + 1;
    }

    /**
     * Start a new game
     */
    function startGame() {
        console.log('ZombieGame: Starting new game');

        // Initialize DOM elements if not already done
        if (!scoreElement) {
            initElements();
        }

        // Reset game state
        gameActive = true;
        score = 0;
        kills = 0;
        misses = 0;

        // Update UI
        updateStats();

        // Show game area, hide instructions and game over
        instructionsPanel.style.display = 'none';
        gameArea.style.display = 'block';
        gameOverScreen.style.display = 'none';

        // Spawn initial zombie (only 1 now)
        spawnZombie();

        console.log('ZombieGame: Game started');
        showMessage('START!', 'hit');
    }

    /**
     * Spawn a zombie with a random target number
     */
    function spawnZombie() {
        const newTarget = randomDartNumber();

        zombieTarget = newTarget;
        targetElement.textContent = newTarget;
        zombieElement.classList.add('respawn');
        setTimeout(() => zombieElement.classList.remove('respawn'), 500);

        console.log(`ZombieGame: Zombie spawned with target ${newTarget}`);
    }

    /**
     * Update stats display
     */
    function updateStats() {
        scoreElement.textContent = score;
        killsElement.textContent = kills;
        missesElement.textContent = `${misses}/${MAX_MISSES}`;

        // Change miss counter color as player gets closer to game over
        const missesBox = missesElement.closest('.stat-box');
        if (misses === 0) {
            missesBox.style.borderColor = 'var(--neon-green)';
        } else if (misses === 1) {
            missesBox.style.borderColor = 'var(--status-warning)';
        } else if (misses >= 2) {
            missesBox.style.borderColor = 'var(--status-error)';
        }
    }

    /**
     * Handle dart throw event from darts-caller
     * @param {Object} dart - Dart throw data
     * @param {number} dart.segment - Dartboard segment number (1-20)
     * @param {number} dart.multiplier - Multiplier (1=single, 2=double, 3=triple)
     * @param {number} dart.value - Point value
     */
    function handleDartThrow(dart) {
        if (!gameActive) {
            console.log('ZombieGame: Game not active, ignoring dart');
            return;
        }

        const segment = dart.segment;
        const multiplier = dart.multiplier;
        const multiplierName = {1: 'Single', 2: 'Double', 3: 'Triple'}[multiplier] || '';

        console.log(`ZombieGame: Dart thrown - Segment ${segment} (${multiplierName})`);

        // Check if dart hit the zombie target
        if (segment === zombieTarget) {
            killZombie(multiplier);
        } else {
            registerMiss(segment);
        }
    }

    /**
     * Kill a zombie and respawn a new one
     * @param {number} multiplier - Dart multiplier for bonus points
     */
    function killZombie(multiplier) {
        console.log('ZombieGame: Zombie killed!');

        // Calculate points (100 base * multiplier)
        const points = 100 * multiplier;
        score += points;
        kills++;

        // Update stats
        updateStats();

        // Visual feedback
        zombieElement.classList.add('hit');

        // Show hit message
        const multiplierText = multiplier > 1 ? `${multiplier}X ` : '';
        showMessage(`${multiplierText}HIT! +${points}`, 'hit');

        // Play kill animation, then respawn
        setTimeout(() => {
            zombieElement.classList.remove('hit');
            spawnZombie();
        }, 500);
    }

    /**
     * Register a miss
     * @param {number} segment - The segment that was hit (but missed target)
     */
    function registerMiss(segment) {
        console.log(`ZombieGame: Miss! Hit ${segment}, needed ${zombieTarget}`);

        misses++;
        updateStats();

        // Visual feedback
        showMessage('MISS!', 'miss');
        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 500);

        // Check for game over
        if (misses >= MAX_MISSES) {
            endGame();
        }
    }

    /**
     * Show temporary message to player
     * @param {string} text - Message text
     * @param {string} type - Message type ('hit' or 'miss')
     */
    function showMessage(text, type) {
        gameMessage.textContent = text;
        gameMessage.className = `game-message ${type} show`;

        setTimeout(() => {
            gameMessage.classList.remove('show');
        }, 1000);
    }

    /**
     * End the game and show game over screen
     */
    function endGame() {
        console.log('ZombieGame: Game Over');

        gameActive = false;

        // Update final stats
        document.getElementById('final-kills').textContent = kills;
        document.getElementById('final-score').textContent = score;

        // Show game over screen
        gameOverScreen.style.display = 'flex';
    }

    /**
     * Check if game is currently active
     * @returns {boolean} True if game is active
     */
    function isGameActive() {
        return gameActive;
    }

    // Public API
    return {
        startGame: startGame,
        handleDartThrow: handleDartThrow,
        isGameActive: isGameActive
    };
})();

// Initialize elements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Zombie Slayer: DOM loaded, game ready');
});
