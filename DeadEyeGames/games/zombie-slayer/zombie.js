/**
 * Zombie Slayer Game Logic
 *
 * Game Mechanics:
 * - 2 zombies on screen at all times
 * - Each zombie has a random target number (1-20)
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

    // Zombie targets
    let zombie1Target = 0;
    let zombie2Target = 0;

    // DOM elements
    let scoreElement, killsElement, missesElement;
    let target1Element, target2Element;
    let zombie1Element, zombie2Element;
    let gameArea, instructionsPanel, gameOverScreen;
    let gameMessage;

    /**
     * Initialize game elements on page load
     */
    function initElements() {
        scoreElement = document.getElementById('score');
        killsElement = document.getElementById('kills');
        missesElement = document.getElementById('misses');
        target1Element = document.getElementById('target1');
        target2Element = document.getElementById('target2');
        zombie1Element = document.getElementById('zombie1');
        zombie2Element = document.getElementById('zombie2');
        gameArea = document.getElementById('game-area');
        instructionsPanel = document.getElementById('instructions');
        gameOverScreen = document.getElementById('game-over');
        gameMessage = document.getElementById('game-message');
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

        // Spawn initial zombies
        spawnZombie(1);
        spawnZombie(2);

        console.log('ZombieGame: Game started');
        showMessage('START!', 'hit');
    }

    /**
     * Spawn a zombie with a random target number
     * @param {number} zombieId - Which zombie (1 or 2)
     */
    function spawnZombie(zombieId) {
        const newTarget = randomDartNumber();

        if (zombieId === 1) {
            zombie1Target = newTarget;
            target1Element.textContent = newTarget;
            zombie1Element.classList.add('respawn');
            setTimeout(() => zombie1Element.classList.remove('respawn'), 500);
        } else {
            zombie2Target = newTarget;
            target2Element.textContent = newTarget;
            zombie2Element.classList.add('respawn');
            setTimeout(() => zombie2Element.classList.remove('respawn'), 500);
        }

        console.log(`ZombieGame: Zombie ${zombieId} spawned with target ${newTarget}`);
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

        // Check if dart hit any zombie target
        let hitZombie = false;

        if (segment === zombie1Target) {
            hitZombie = true;
            killZombie(1, multiplier);
        } else if (segment === zombie2Target) {
            hitZombie = true;
            killZombie(2, multiplier);
        }

        // If no hit, register a miss
        if (!hitZombie) {
            registerMiss(segment);
        }
    }

    /**
     * Kill a zombie and respawn a new one
     * @param {number} zombieId - Which zombie was killed (1 or 2)
     * @param {number} multiplier - Dart multiplier for bonus points
     */
    function killZombie(zombieId, multiplier) {
        console.log(`ZombieGame: Zombie ${zombieId} killed!`);

        // Calculate points (100 base * multiplier)
        const points = 100 * multiplier;
        score += points;
        kills++;

        // Update stats
        updateStats();

        // Visual feedback
        const zombieElement = zombieId === 1 ? zombie1Element : zombie2Element;
        zombieElement.classList.add('hit');

        // Show hit message
        const multiplierText = multiplier > 1 ? `${multiplier}X ` : '';
        showMessage(`${multiplierText}HIT! +${points}`, 'hit');

        // Play kill animation, then respawn
        setTimeout(() => {
            zombieElement.classList.remove('hit');
            spawnZombie(zombieId);
        }, 500);
    }

    /**
     * Register a miss
     * @param {number} segment - The segment that was hit (but missed target)
     */
    function registerMiss(segment) {
        console.log(`ZombieGame: Miss! Hit ${segment}, needed ${zombie1Target} or ${zombie2Target}`);

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
