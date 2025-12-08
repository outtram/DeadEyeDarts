/**
 * Station Siege - Space Defense Dart Game
 * Defend your station by throwing darts at hostile spacecraft!
 * Based on Defender 4 mechanics, integrated with autodarts.io
 *
 * Features:
 * - Seeded RNG for reproducible games (compare scores with friends)
 * - Cooperative multiplayer (multiple players defend same station)
 * - Game event logging for replays and leaderboards
 */

const StationSiege = (function() {
    // =========================================================================
    // SEEDED RANDOM NUMBER GENERATOR (Mulberry32)
    // =========================================================================

    let currentSeed = null;
    let rngState = null;

    // Mulberry32 - fast, high-quality 32-bit PRNG
    function createRNG(seed) {
        let state = seed;
        return function() {
            state |= 0;
            state = state + 0x6D2B79F5 | 0;
            let t = Math.imul(state ^ state >>> 15, 1 | state);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    // Seeded random function (use this instead of Math.random())
    function seededRandom() {
        if (rngState) {
            return rngState();
        }
        return Math.random();
    }

    // Generate a seed from string (for shareable codes)
    function stringToSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Generate random seed
    function generateRandomSeed() {
        return Math.floor(Math.random() * 1000000);
    }

    // Format seed for display
    function formatSeed(seed) {
        return seed.toString().padStart(6, '0');
    }

    // =========================================================================
    // GAME EVENT LOGGING
    // =========================================================================

    let gameLog = [];
    let gameStartTime = null;

    function logEvent(type, data = {}) {
        if (!gameStartTime) return;

        const event = {
            time: Date.now() - gameStartTime,
            round: round,
            type: type,
            ...data
        };
        gameLog.push(event);

        // Broadcast to multiplayer if connected
        if (multiplayerSocket && multiplayerRoom) {
            multiplayerSocket.emit('game_event', {
                room: multiplayerRoom,
                player: playerName,
                event: event
            });
        }
    }

    function getGameSummary() {
        return {
            seed: currentSeed,
            finalScore: score,
            roundsPlayed: round,
            duration: gameStartTime ? Date.now() - gameStartTime : 0,
            events: gameLog,
            player: playerName,
            timestamp: new Date().toISOString()
        };
    }

    // =========================================================================
    // MULTIPLAYER STATE
    // =========================================================================

    let multiplayerSocket = null;
    let multiplayerRoom = null;
    let playerName = 'Player';
    let isHost = false;
    let connectedPlayers = [];
    let gameMode = 'solo'; // 'solo', 'coop'

    // Shared state for coop (synced from host)
    let sharedState = null;

    // =========================================================================
    // SOUND EFFECTS (Space/Zapping sounds)
    // =========================================================================

    let audioContext = null;

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function playSound(type) {
        try {
            const ctx = initAudio();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            switch(type) {
                case 'laser':
                    // Pew pew laser shot
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
                    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.15);
                    break;

                case 'plasma':
                    // Heavy plasma blast
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
                    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.3);
                    break;

                case 'emp':
                    // EMP zap - rising then crackling
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.1);
                    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);
                    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.4);
                    break;

                case 'explosion':
                    // Ship explosion
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5);
                    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.5);
                    break;

                case 'shield_hit':
                    // Shield taking damage
                    oscillator.type = 'triangle';
                    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
                    oscillator.frequency.setValueAtTime(200, ctx.currentTime + 0.05);
                    oscillator.frequency.setValueAtTime(100, ctx.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.2);
                    break;

                case 'powerup':
                    // Power-up collected
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                    oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.3);
                    break;

                case 'spawn':
                    // Enemy spawn warning
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                    oscillator.frequency.setValueAtTime(250, ctx.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(200, ctx.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.3);
                    break;

                case 'forcefield':
                    // Force field deploy
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.3);
                    break;

                case 'miss':
                    // Shot missed
                    oscillator.type = 'triangle';
                    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.1);
                    break;

                case 'alarm':
                    // Red alert alarm
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                    oscillator.frequency.setValueAtTime(300, ctx.currentTime + 0.2);
                    oscillator.frequency.setValueAtTime(400, ctx.currentTime + 0.4);
                    oscillator.frequency.setValueAtTime(300, ctx.currentTime + 0.6);
                    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.8);
                    break;

                case 'gameover':
                    // Game over explosion
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 1);
                    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 1);
                    break;

                case 'dreadnought':
                    // Dreadnought warning
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(80, ctx.currentTime);
                    oscillator.frequency.setValueAtTime(100, ctx.currentTime + 0.3);
                    oscillator.frequency.setValueAtTime(80, ctx.currentTime + 0.6);
                    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);
                    oscillator.start(ctx.currentTime);
                    oscillator.stop(ctx.currentTime + 0.9);
                    break;
            }
        } catch (e) {
            console.log('Audio not available:', e);
        }
    }

    // =========================================================================
    // CONFIGURATION
    // =========================================================================

    const CONFIG = {
        INITIAL_SHIELDS: 5,
        MAX_SHIELDS: 10,
        INITIAL_ENERGY: 3,
        MAX_ARMORY: 6,
        STEPS_TO_STATION: 6,
        MAX_HOSTILES: 8,
        ALERT_CYCLE: 12  // Rounds per alert cycle
    };

    // Dartboard number layout (clockwise from top)
    const DARTBOARD_NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

    // Hostile types
    const HOSTILE_TYPES = {
        SCOUT: {
            name: 'Scout',
            color: '#00ffff',
            speed: 1,
            baseHP: 1,
            maxHP: 6,
            icon: '◇'
        },
        FIGHTER: {
            name: 'Fighter',
            color: '#ff8800',
            speed: 2,
            baseHP: 1,
            maxHP: 3,
            icon: '▷'
        },
        FRIGATE: {
            name: 'Frigate',
            color: '#00ffff',
            speed: 1,
            baseHP: 3,
            maxHP: 9,
            icon: '◈'
        },
        DREADNOUGHT: {
            name: 'Dreadnought',
            color: '#ff00ff',
            speed: 0.5,
            isSequence: true,
            icon: '◆'
        },
        HACKER: {
            name: 'Hacker Drone',
            color: '#00ff00',
            speed: 2,
            baseHP: 1,
            maxHP: 1,
            steals: true,
            icon: '◊'
        }
    };

    // Power-up types
    const POWERUP_TYPES = {
        PLASMA: { name: 'Plasma Shot', icon: '⚡', color: '#ff00ff', effect: 'damage_x3' },
        EMP: { name: 'EMP Blast', icon: '◎', color: '#ffff00', effect: 'stun_all' },
        FORCEFIELD: { name: 'Force Field', icon: '◯', color: '#00ff00', effect: 'deploy_shield' },
        SHIELD: { name: 'Shield Cell', icon: '♦', color: '#00ffff', effect: 'restore_shield' }
    };

    // =========================================================================
    // GAME STATE
    // =========================================================================

    let gameActive = false;
    let round = 1;
    let score = 0;
    let shields = CONFIG.INITIAL_SHIELDS;
    let energyCells = CONFIG.INITIAL_ENERGY;
    let hostiles = [];
    let armory = [];
    let forceFields = [];
    let numberPool = [];  // Available numbers for hostiles

    // Active effects
    let plasmaActive = false;
    let empActive = false;
    let empRoundsLeft = 0;

    // Canvas & rendering
    let canvas, ctx;
    let animationId;

    // DOM elements
    let elements = {};

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    function initElements() {
        elements = {
            titleScreen: document.getElementById('title-screen'),
            gameScreen: document.getElementById('game-screen'),
            gameoverScreen: document.getElementById('gameover-screen'),
            roundNumber: document.getElementById('round-number'),
            scoreValue: document.getElementById('score-value'),
            alertStatus: document.getElementById('alert-status'),
            shieldFill: document.getElementById('shield-fill'),
            shieldCount: document.getElementById('shield-count'),
            energyCells: document.getElementById('energy-cells'),
            armoryGrid: document.getElementById('armory-grid'),
            armoryCount: document.getElementById('armory-count'),
            dartboard: document.getElementById('dartboard'),
            announcement: document.getElementById('announcement'),
            announcementText: document.getElementById('announcement-text'),
            activeEffects: document.getElementById('active-effects'),
            gameoverStats: document.getElementById('gameover-stats')
        };

        canvas = document.getElementById('battle-canvas');
        ctx = canvas.getContext('2d');

        // Generate dartboard SVG
        generateDartboard();
    }

    function startGame(seedInput = null) {
        if (!elements.titleScreen) initElements();

        // Initialize seed
        if (seedInput !== null) {
            currentSeed = typeof seedInput === 'string' ? stringToSeed(seedInput) : seedInput;
        } else {
            // Check for seed input field
            const seedField = document.getElementById('seed-input');
            if (seedField && seedField.value.trim()) {
                const val = seedField.value.trim();
                currentSeed = /^\d+$/.test(val) ? parseInt(val) : stringToSeed(val);
            } else {
                currentSeed = generateRandomSeed();
            }
        }

        // Initialize seeded RNG
        rngState = createRNG(currentSeed);

        // Reset game log
        gameLog = [];
        gameStartTime = Date.now();

        // Reset game state
        gameActive = true;
        round = 1;
        score = 0;
        shields = CONFIG.INITIAL_SHIELDS;
        energyCells = CONFIG.INITIAL_ENERGY;
        hostiles = [];
        armory = [];
        forceFields = [];
        plasmaActive = false;
        empActive = false;
        empRoundsLeft = 0;

        // Shuffle and distribute numbers (using seeded RNG)
        shuffleNumbers();

        // Switch screens
        elements.titleScreen.classList.remove('active');
        elements.gameoverScreen.classList.remove('active');
        elements.gameScreen.classList.add('active');

        // Update seed display
        const seedDisplay = document.getElementById('current-seed');
        if (seedDisplay) {
            seedDisplay.textContent = formatSeed(currentSeed);
        }

        // Resize canvas
        resizeCanvas();

        // Give player starting power-ups (2 random items)
        setTimeout(() => {
            addRandomPowerUp();
            addRandomPowerUp();
            showAnnouncement('ARMORY STOCKED!');
        }, 500);

        // Log game start
        logEvent('game_start', { seed: currentSeed, mode: gameMode, player: playerName });

        // Update UI
        updateUI();
        updateArmoryDisplay();

        // Start first round
        startRound();

        // Start render loop
        if (animationId) cancelAnimationFrame(animationId);
        renderLoop();

        console.log(`StationSiege: Game started! Seed: ${formatSeed(currentSeed)}`);
    }

    function shuffleNumbers() {
        // Shuffle 1-20 for hostile number pool using seeded RNG
        let numbers = [];
        for (let i = 1; i <= 20; i++) numbers.push(i);

        // Fisher-Yates shuffle with seeded random
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        // All numbers available for hostiles (armory picks unused numbers dynamically)
        numberPool = numbers;
    }

    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth - 20;
        canvas.height = 500;
    }

    // =========================================================================
    // ROUND MANAGEMENT
    // =========================================================================

    function startRound() {
        energyCells = CONFIG.INITIAL_ENERGY;

        // Handle EMP duration
        if (empActive) {
            empRoundsLeft--;
            if (empRoundsLeft <= 0) {
                empActive = false;
                showAnnouncement('EMP EFFECT ENDED');
            }
        }

        // Advance existing hostiles
        advanceHostiles();

        // Spawn new hostiles
        spawnHostiles();

        // Update alert status
        updateAlertStatus();

        // Update UI
        updateUI();
        updateEnergyDisplay();

        console.log(`StationSiege: Round ${round} started`);
    }

    function endRound() {
        round++;

        // Check if all hostiles cleared - bonus items
        if (hostiles.length === 0 && energyCells > 0) {
            showAnnouncement(`SECTOR CLEAR! +${energyCells} BONUS ITEMS`);
            for (let i = 0; i < energyCells; i++) {
                setTimeout(() => addRandomPowerUp(), i * 200);
            }
        }

        // Start next round after delay
        setTimeout(() => {
            if (gameActive) startRound();
        }, 1000);
    }

    function getAlertLevel() {
        const cyclePosition = round % CONFIG.ALERT_CYCLE;
        if (cyclePosition >= 3 && cyclePosition <= 5) return 'RED_ALERT';
        if (cyclePosition >= 6 && cyclePosition <= 8) return 'DE_ESCALATING';
        if (cyclePosition >= 9 && cyclePosition <= 11) return 'ALL_CLEAR';
        return 'WARNING';
    }

    function updateAlertStatus() {
        const level = getAlertLevel();
        const alertEl = elements.alertStatus;

        alertEl.className = 'alert-status';

        switch (level) {
            case 'RED_ALERT':
                alertEl.classList.add('red-alert');
                alertEl.querySelector('.alert-text').textContent = 'RED ALERT';
                if (round % CONFIG.ALERT_CYCLE === 3) {
                    playSound('alarm');
                    showAnnouncement('RED ALERT! HEAVY HOSTILES INCOMING!');
                }
                break;
            case 'DE_ESCALATING':
                alertEl.classList.add('de-escalating');
                alertEl.querySelector('.alert-text').textContent = 'DE-ESCALATING';
                break;
            case 'ALL_CLEAR':
                alertEl.classList.add('all-clear');
                alertEl.querySelector('.alert-text').textContent = 'ALL CLEAR';
                break;
            default:
                alertEl.classList.add('warning');
                alertEl.querySelector('.alert-text').textContent = 'WARNING';
        }
    }

    // =========================================================================
    // HOSTILE MANAGEMENT
    // =========================================================================

    function spawnHostiles() {
        const alertLevel = getAlertLevel();

        // No spawning during ALL CLEAR
        if (alertLevel === 'ALL_CLEAR') return;

        // Calculate spawn count
        let spawnCount = 1 + Math.floor(round / 7);
        if (alertLevel === 'RED_ALERT') spawnCount++;

        // Limit by max hostiles
        spawnCount = Math.min(spawnCount, CONFIG.MAX_HOSTILES - hostiles.length);

        for (let i = 0; i < spawnCount; i++) {
            const hostile = createHostile();
            if (hostile) {
                hostiles.push(hostile);
                playSound('spawn');
            }
        }
    }

    function createHostile() {
        if (numberPool.length === 0) return null;

        // Determine type based on round and probabilities
        let type = 'SCOUT';
        const alertLevel = getAlertLevel();

        // Dreadnought: Round 5+, RED_ALERT only, 10% chance, max 1
        if (round >= 5 && alertLevel === 'RED_ALERT' && seededRandom() < 0.1) {
            const hasDreadnought = hostiles.some(h => h.type === 'DREADNOUGHT');
            if (!hasDreadnought) {
                type = 'DREADNOUGHT';
                playSound('dreadnought');
                showAnnouncement('DREADNOUGHT DETECTED!');
            }
        }
        // Hacker: Round 3+, 15% chance
        else if (round >= 3 && seededRandom() < 0.15) {
            type = 'HACKER';
        }
        // Frigate: Round 4+
        else if (round >= 4 && seededRandom() < (0.25 + round / 60)) {
            type = 'FRIGATE';
        }
        // Fighter: Round 6+
        else if (round >= 6 && seededRandom() < (0.75 - round / 40)) {
            type = 'FIGHTER';
        }

        const typeData = HOSTILE_TYPES[type];

        // Get target number
        const targetNumber = numberPool.shift();

        // Calculate HP
        let hp = 1;
        if (type !== 'DREADNOUGHT') {
            const baseHP = Math.ceil(seededRandom() * (1 + round / 5));
            if (type === 'FIGHTER') {
                hp = Math.max(1, Math.min(baseHP - 1, typeData.maxHP));
            } else if (type === 'FRIGATE') {
                hp = Math.min(baseHP + 2 + Math.floor(round / 12), typeData.maxHP);
            } else {
                hp = Math.min(baseHP, typeData.maxHP);
            }
        }

        const hostile = {
            id: Date.now() + seededRandom(),
            type: type,
            name: typeData.name,
            color: typeData.color,
            icon: typeData.icon,
            targetNumber: targetNumber,
            hp: hp,
            maxHP: hp,
            position: 0,  // 0 = spawn, 6 = at station
            speed: typeData.speed,
            stunned: empActive,
            x: 0,
            y: 0
        };

        // Dreadnought has sequence
        if (type === 'DREADNOUGHT') {
            hostile.sequence = [targetNumber];
            // Add second number to sequence
            if (numberPool.length > 0) {
                hostile.sequence.push(numberPool.shift());
            }
            hostile.sequenceIndex = 0;
        }

        // Calculate visual position
        updateHostilePosition(hostile);

        return hostile;
    }

    function updateHostilePosition(hostile) {
        // Position based on step (0-6)
        const progress = hostile.position / CONFIG.STEPS_TO_STATION;
        const startY = 50;
        const endY = canvas.height - 80;

        hostile.y = startY + (endY - startY) * progress;
        hostile.x = 100 + seededRandom() * (canvas.width - 200);
    }

    function advanceHostiles() {
        hostiles.forEach(hostile => {
            if (hostile.stunned) {
                hostile.stunned = false;  // Stun wears off
                return;
            }

            // Check for force field collision
            let blocked = false;
            forceFields.forEach(ff => {
                if (Math.abs(hostile.y - ff.y) < 30 && ff.strength > 0) {
                    ff.strength--;
                    hostile.hp--;
                    blocked = true;
                    playSound('forcefield');
                    if (hostile.hp <= 0) {
                        destroyHostile(hostile);
                    }
                    if (ff.strength <= 0) {
                        forceFields = forceFields.filter(f => f !== ff);
                    }
                }
            });

            if (!blocked && hostile.hp > 0) {
                hostile.position += hostile.speed;
                updateHostilePosition(hostile);

                // Reached station?
                if (hostile.position >= CONFIG.STEPS_TO_STATION) {
                    hostileReachesStation(hostile);
                }
            }
        });

        // Remove dead hostiles
        hostiles = hostiles.filter(h => h.hp > 0 && h.position < CONFIG.STEPS_TO_STATION);
    }

    function hostileReachesStation(hostile) {
        playSound('shield_hit');

        if (hostile.type === 'HACKER' && armory.length > 0) {
            // Steal random item
            const stolenIndex = Math.floor(seededRandom() * armory.length);
            armory.splice(stolenIndex, 1);
            showAnnouncement('ITEM STOLEN BY HACKER!');
        } else {
            // Damage shields
            shields--;
            showAnnouncement('SHIELDS HIT!');
        }

        // Return number to pool
        if (hostile.targetNumber) {
            numberPool.push(hostile.targetNumber);
        }
        if (hostile.sequence) {
            hostile.sequence.forEach(n => {
                if (!numberPool.includes(n)) numberPool.push(n);
            });
        }

        // Remove hostile
        hostiles = hostiles.filter(h => h.id !== hostile.id);

        updateUI();

        // Check game over
        if (shields <= 0) {
            gameOver();
        }
    }

    function destroyHostile(hostile) {
        playSound('explosion');
        score += hostile.maxHP;

        // Return number to pool
        if (hostile.targetNumber) {
            numberPool.push(hostile.targetNumber);
        }

        // Dreadnought special rewards
        if (hostile.type === 'DREADNOUGHT') {
            score += 6;
            showAnnouncement('DREADNOUGHT DESTROYED! +6 BONUS');
            // Spawn multiple power-ups
            for (let i = 0; i < 3; i++) {
                setTimeout(() => addRandomPowerUp(), i * 200);
            }
        }

        // Overkill bonus
        if (hostile.overkill && hostile.overkill > 0) {
            for (let i = 0; i < hostile.overkill; i++) {
                addRandomPowerUp();
            }
        }

        // Random power-up chance (40% for regular kills)
        if (seededRandom() < 0.4) {
            addRandomPowerUp();
        }

        updateUI();
    }

    // =========================================================================
    // DART HANDLING
    // =========================================================================

    function handleDartThrow(dart) {
        if (!gameActive) return;
        if (energyCells <= 0) return;

        const { segment, multiplier, value } = dart;
        energyCells--;
        updateEnergyDisplay();

        console.log(`StationSiege: Dart hit - ${segment} x${multiplier} = ${value}`);

        // Check for bullseye (uses plasma)
        const isBullseye = segment === 25 || segment === 0;

        if (isBullseye) {
            handleBullseye(multiplier);
            checkRoundEnd();
            return;
        }

        // Check if hit an armory item number
        const armoryItem = armory.find(item => item.number === segment);
        if (armoryItem) {
            activateItem(segment, multiplier);
            checkRoundEnd();
            return;
        }

        // Find hostile with this target number
        const targetHostile = hostiles.find(h => {
            if (h.type === 'DREADNOUGHT') {
                return h.sequence[h.sequenceIndex] === segment;
            }
            return h.targetNumber === segment;
        });

        if (targetHostile) {
            attackHostile(targetHostile, multiplier, segment);
        } else {
            // Miss
            playSound('miss');
        }

        checkRoundEnd();
    }

    function handleBullseye(multiplier) {
        // Bullseye uses plasma if available
        if (plasmaActive) {
            playSound('plasma');

            // Deal massive damage to all hostiles
            const damage = (multiplier === 2 ? 2 : 1) * 3;
            hostiles.forEach(hostile => {
                if (hostile.type !== 'DREADNOUGHT') {
                    hostile.hp -= damage;
                    score += Math.min(damage, hostile.maxHP);
                    if (hostile.hp <= 0) {
                        destroyHostile(hostile);
                    }
                }
            });

            plasmaActive = false;
            showAnnouncement('PLASMA BURST!');
        } else {
            // Just regular bullseye - damage random hostile
            playSound('laser');
            if (hostiles.length > 0) {
                const target = hostiles[Math.floor(seededRandom() * hostiles.length)];
                const damage = multiplier === 2 ? 2 : 1;
                target.hp -= damage;
                score += Math.min(damage, target.maxHP);
                if (target.hp <= 0) {
                    destroyHostile(target);
                }
            }
        }

        updateUI();
        updateActiveEffects();
        hostiles = hostiles.filter(h => h.hp > 0);
    }

    function attackHostile(hostile, multiplier, segment) {
        let damage = multiplier;

        // Plasma multiplier
        if (plasmaActive) {
            damage *= 3;
            plasmaActive = false;
            playSound('plasma');
            showAnnouncement('PLASMA SHOT!');
        } else {
            playSound('laser');
        }

        // EMP doubles damage
        if (empActive || hostile.stunned) {
            damage *= 2;
        }

        // Dreadnought sequence handling
        if (hostile.type === 'DREADNOUGHT') {
            hostile.sequenceIndex++;
            if (hostile.sequenceIndex >= hostile.sequence.length) {
                // Sequence complete - destroy it
                destroyHostile(hostile);
                hostiles = hostiles.filter(h => h.id !== hostile.id);
            } else {
                showAnnouncement(`DREADNOUGHT: HIT ${hostile.sequence[hostile.sequenceIndex]} NEXT!`);
            }
        } else {
            hostile.hp -= damage;
            score += Math.min(damage, hostile.maxHP);

            // Track overkill
            if (hostile.hp < 0) {
                hostile.overkill = Math.abs(hostile.hp);
            }

            if (hostile.hp <= 0) {
                destroyHostile(hostile);
                hostiles = hostiles.filter(h => h.id !== hostile.id);
            }
        }

        updateUI();
        updateActiveEffects();
    }

    function activateItem(number, multiplier) {
        // Find item in armory with this number
        const itemIndex = armory.findIndex(item => item.number === number);

        if (itemIndex === -1) {
            playSound('miss');
            return;
        }

        const item = armory[itemIndex];
        armory.splice(itemIndex, 1);
        playSound('powerup');

        switch (item.type) {
            case 'PLASMA':
                plasmaActive = true;
                showAnnouncement('PLASMA CHARGED!');
                break;

            case 'EMP':
                empActive = true;
                empRoundsLeft = multiplier >= 2 ? 2 : 1;
                playSound('emp');
                showAnnouncement('EMP ACTIVATED!');
                // Stun all hostiles
                hostiles.forEach(h => h.stunned = true);
                break;

            case 'FORCEFIELD':
                const ffStrength = 3 + Math.floor(seededRandom() * 3);
                forceFields.push({
                    y: 150 + seededRandom() * 200,
                    strength: ffStrength
                });
                playSound('forcefield');
                showAnnouncement('FORCE FIELD DEPLOYED!');
                break;

            case 'SHIELD':
                const shieldRestore = (1 + Math.floor(seededRandom() * 2)) * multiplier;
                shields = Math.min(CONFIG.MAX_SHIELDS, shields + shieldRestore);
                showAnnouncement(`+${shieldRestore} SHIELDS RESTORED!`);
                break;
        }

        updateUI();
        updateActiveEffects();
        updateArmoryDisplay();
    }

    function checkRoundEnd() {
        if (energyCells <= 0) {
            setTimeout(() => endRound(), 500);
        }
    }

    // =========================================================================
    // POWER-UPS
    // =========================================================================

    function addRandomPowerUp() {
        if (armory.length >= CONFIG.MAX_ARMORY) {
            // Overflow converts to shields
            shields = Math.min(CONFIG.MAX_SHIELDS, shields + 1);
            showAnnouncement('+1 SHIELD (ARMORY FULL)');
            updateUI();
            return;
        }

        // Pick a number not currently used by hostiles or armory
        const usedByHostiles = hostiles.map(h => h.targetNumber).filter(n => n);
        const usedByArmory = armory.map(a => a.number);
        const usedNumbers = [...usedByHostiles, ...usedByArmory];

        // Find available numbers (1-20 that aren't in use)
        const availableNumbers = [];
        for (let i = 1; i <= 20; i++) {
            if (!usedNumbers.includes(i)) {
                availableNumbers.push(i);
            }
        }

        if (availableNumbers.length === 0) return;

        const number = availableNumbers[Math.floor(seededRandom() * availableNumbers.length)];

        // Pick random type
        const types = Object.keys(POWERUP_TYPES);
        const type = types[Math.floor(seededRandom() * types.length)];
        const typeData = POWERUP_TYPES[type];

        armory.push({
            type: type,
            name: typeData.name,
            icon: typeData.icon,
            color: typeData.color,
            number: number
        });

        playSound('powerup');
        updateArmoryDisplay();
    }

    // =========================================================================
    // UI UPDATES
    // =========================================================================

    function updateUI() {
        elements.roundNumber.textContent = round;
        elements.scoreValue.textContent = score;

        // Shields
        const shieldPercent = (shields / CONFIG.MAX_SHIELDS) * 100;
        elements.shieldFill.style.width = `${shieldPercent}%`;
        elements.shieldCount.textContent = `${shields}/${CONFIG.MAX_SHIELDS}`;

        if (shields <= 2) {
            elements.shieldFill.classList.add('low');
        } else {
            elements.shieldFill.classList.remove('low');
        }
    }

    function updateEnergyDisplay() {
        const cells = elements.energyCells.querySelectorAll('.cell');
        cells.forEach((cell, i) => {
            if (i < energyCells) {
                cell.classList.add('active');
            } else {
                cell.classList.remove('active');
            }
        });
    }

    function updateArmoryDisplay() {
        elements.armoryGrid.innerHTML = '';
        elements.armoryCount.textContent = `${armory.length}/${CONFIG.MAX_ARMORY}`;

        armory.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = `armory-item ${item.type.toLowerCase()}`;
            itemEl.innerHTML = `
                <span class="item-icon">${item.icon}</span>
                <span class="item-number">${item.number}</span>
            `;
            elements.armoryGrid.appendChild(itemEl);
        });
    }

    function updateActiveEffects() {
        elements.activeEffects.innerHTML = '';

        if (plasmaActive) {
            const badge = document.createElement('div');
            badge.className = 'effect-badge plasma';
            badge.innerHTML = '⚡ PLASMA READY';
            elements.activeEffects.appendChild(badge);
        }

        if (empActive) {
            const badge = document.createElement('div');
            badge.className = 'effect-badge emp';
            badge.innerHTML = `◎ EMP ACTIVE (${empRoundsLeft})`;
            elements.activeEffects.appendChild(badge);
        }
    }

    function showAnnouncement(text) {
        elements.announcementText.textContent = text;
        elements.announcement.classList.remove('hidden');

        setTimeout(() => {
            elements.announcement.classList.add('hidden');
        }, 2000);
    }

    // =========================================================================
    // DARTBOARD GENERATION
    // =========================================================================

    function generateDartboard() {
        const svg = elements.dartboard;
        const cx = 200, cy = 200;
        const numbers = DARTBOARD_NUMBERS;

        let html = '';

        // Background
        html += `<circle cx="${cx}" cy="${cy}" r="195" fill="#0a0a15" stroke="#00ffff" stroke-width="2"/>`;

        // Generate segments
        const angleStep = 360 / 20;
        const startAngle = -99; // Offset so 20 is at top

        for (let i = 0; i < 20; i++) {
            const num = numbers[i];
            const angle1 = startAngle + i * angleStep;
            const angle2 = startAngle + (i + 1) * angleStep;

            const isEven = i % 2 === 0;

            // Double ring (outer)
            html += createSegment(cx, cy, 170, 190, angle1, angle2, num, 2,
                isEven ? 'red-double' : 'green-double');

            // Outer single
            html += createSegment(cx, cy, 110, 170, angle1, angle2, num, 1,
                isEven ? 'black' : 'white');

            // Triple ring
            html += createSegment(cx, cy, 95, 110, angle1, angle2, num, 3,
                isEven ? 'red-triple' : 'green-triple');

            // Inner single
            html += createSegment(cx, cy, 30, 95, angle1, angle2, num, 1,
                isEven ? 'black' : 'white');

            // Number label
            const labelAngle = (angle1 + angle2) / 2 * Math.PI / 180;
            const labelR = 180;
            const lx = cx + Math.cos(labelAngle) * labelR;
            const ly = cy + Math.sin(labelAngle) * labelR;
            html += `<text x="${lx}" y="${ly + 4}" class="segment-number">${num}</text>`;
        }

        // Bull (outer)
        html += `<circle cx="${cx}" cy="${cy}" r="30" class="segment bull" data-segment="25" data-multiplier="1"/>`;

        // Double bull (inner)
        html += `<circle cx="${cx}" cy="${cy}" r="12" class="segment double-bull" data-segment="25" data-multiplier="2"/>`;

        svg.innerHTML = html;
    }

    function createSegment(cx, cy, r1, r2, angle1, angle2, number, multiplier, className) {
        const a1 = angle1 * Math.PI / 180;
        const a2 = angle2 * Math.PI / 180;

        const x1 = cx + Math.cos(a1) * r1;
        const y1 = cy + Math.sin(a1) * r1;
        const x2 = cx + Math.cos(a2) * r1;
        const y2 = cy + Math.sin(a2) * r1;
        const x3 = cx + Math.cos(a2) * r2;
        const y3 = cy + Math.sin(a2) * r2;
        const x4 = cx + Math.cos(a1) * r2;
        const y4 = cy + Math.sin(a1) * r2;

        const largeArc = (angle2 - angle1) > 180 ? 1 : 0;

        const d = `M ${x1} ${y1}
                   A ${r1} ${r1} 0 ${largeArc} 1 ${x2} ${y2}
                   L ${x3} ${y3}
                   A ${r2} ${r2} 0 ${largeArc} 0 ${x4} ${y4}
                   Z`;

        return `<path d="${d}" class="segment ${className}"
                      data-segment="${number}" data-multiplier="${multiplier}"/>`;
    }

    // =========================================================================
    // RENDERING
    // =========================================================================

    function renderLoop() {
        if (!gameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        drawGrid();

        // Draw station at bottom
        drawStation();

        // Draw force fields
        drawForceFields();

        // Draw hostiles
        drawHostiles();

        // Draw effects/particles
        drawEffects();

        animationId = requestAnimationFrame(renderLoop);
    }

    function drawGrid() {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Horizontal lines
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Vertical lines
        for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }

    function drawStation() {
        const y = canvas.height - 40;
        const cx = canvas.width / 2;

        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';

        // Station body
        ctx.beginPath();
        ctx.moveTo(cx - 100, y);
        ctx.lineTo(cx - 80, y - 20);
        ctx.lineTo(cx + 80, y - 20);
        ctx.lineTo(cx + 100, y);
        ctx.lineTo(cx + 80, y + 10);
        ctx.lineTo(cx - 80, y + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Station details
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(cx - 30, y - 15, 60, 10);

        // Wings
        ctx.beginPath();
        ctx.moveTo(cx - 100, y);
        ctx.lineTo(cx - 150, y - 10);
        ctx.lineTo(cx - 150, y + 10);
        ctx.lineTo(cx - 100, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 100, y);
        ctx.lineTo(cx + 150, y - 10);
        ctx.lineTo(cx + 150, y + 10);
        ctx.lineTo(cx + 100, y);
        ctx.stroke();

        // Label
        ctx.font = '12px "Press Start 2P"';
        ctx.fillStyle = '#00ffff';
        ctx.textAlign = 'center';
        ctx.fillText('STATION OMEGA', cx, y + 30);
    }

    function drawForceFields() {
        forceFields.forEach(ff => {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);

            ctx.beginPath();
            ctx.moveTo(50, ff.y);
            ctx.lineTo(canvas.width - 50, ff.y);
            ctx.stroke();

            ctx.setLineDash([]);

            // Strength indicator
            ctx.fillStyle = '#00ff00';
            ctx.font = '10px "VT323"';
            ctx.fillText(`STR: ${ff.strength}`, 60, ff.y - 5);
        });
    }

    function drawHostiles() {
        hostiles.forEach(hostile => {
            const x = hostile.x || canvas.width / 2;
            const y = hostile.y || 50;

            ctx.save();

            // Glow effect
            ctx.shadowColor = hostile.color;
            ctx.shadowBlur = hostile.stunned ? 20 : 10;

            // Draw ship based on type
            ctx.strokeStyle = hostile.color;
            ctx.fillStyle = hostile.stunned ? 'rgba(255, 255, 0, 0.3)' : 'rgba(0, 0, 0, 0.8)';
            ctx.lineWidth = 2;

            if (hostile.type === 'SCOUT') {
                drawScout(x, y);
            } else if (hostile.type === 'FIGHTER') {
                drawFighter(x, y);
            } else if (hostile.type === 'FRIGATE') {
                drawFrigate(x, y);
            } else if (hostile.type === 'DREADNOUGHT') {
                drawDreadnought(x, y);
            } else if (hostile.type === 'HACKER') {
                drawHacker(x, y);
            }

            ctx.restore();

            // Draw target number
            ctx.fillStyle = hostile.color;
            ctx.font = 'bold 16px "Press Start 2P"';
            ctx.textAlign = 'center';

            if (hostile.type === 'DREADNOUGHT') {
                const seq = hostile.sequence.map((n, i) =>
                    i < hostile.sequenceIndex ? '✓' : n
                ).join(' ');
                ctx.fillText(seq, x, y + 35);
            } else {
                ctx.fillText(hostile.targetNumber.toString(), x, y + 35);
            }

            // HP bar
            if (hostile.type !== 'DREADNOUGHT' && hostile.maxHP > 1) {
                const barWidth = 40;
                const hpPercent = hostile.hp / hostile.maxHP;
                ctx.fillStyle = '#333';
                ctx.fillRect(x - barWidth/2, y + 40, barWidth, 4);
                ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
                ctx.fillRect(x - barWidth/2, y + 40, barWidth * hpPercent, 4);
            }
        });
    }

    function drawScout(x, y) {
        ctx.beginPath();
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x + 12, y + 10);
        ctx.lineTo(x, y + 5);
        ctx.lineTo(x - 12, y + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawFighter(x, y) {
        ctx.beginPath();
        ctx.moveTo(x, y - 18);
        ctx.lineTo(x + 20, y + 12);
        ctx.lineTo(x + 8, y + 8);
        ctx.lineTo(x, y + 15);
        ctx.lineTo(x - 8, y + 8);
        ctx.lineTo(x - 20, y + 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawFrigate(x, y) {
        ctx.beginPath();
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x + 15, y - 5);
        ctx.lineTo(x + 25, y + 10);
        ctx.lineTo(x + 10, y + 15);
        ctx.lineTo(x, y + 10);
        ctx.lineTo(x - 10, y + 15);
        ctx.lineTo(x - 25, y + 10);
        ctx.lineTo(x - 15, y - 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawDreadnought(x, y) {
        ctx.lineWidth = 3;

        // Main body
        ctx.beginPath();
        ctx.moveTo(x, y - 30);
        ctx.lineTo(x + 20, y - 10);
        ctx.lineTo(x + 35, y + 5);
        ctx.lineTo(x + 25, y + 20);
        ctx.lineTo(x, y + 25);
        ctx.lineTo(x - 25, y + 20);
        ctx.lineTo(x - 35, y + 5);
        ctx.lineTo(x - 20, y - 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Core
        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawHacker(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Antenna
        ctx.beginPath();
        ctx.moveTo(x, y - 12);
        ctx.lineTo(x, y - 20);
        ctx.lineTo(x + 5, y - 25);
        ctx.stroke();
    }

    function drawEffects() {
        // EMP field effect
        if (empActive) {
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const offset = (Date.now() / 50 + i * 50) % 150;
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height - 40, 100 + offset, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    // =========================================================================
    // GAME OVER
    // =========================================================================

    function gameOver() {
        gameActive = false;
        playSound('gameover');

        // Log game over
        logEvent('game_over', { finalScore: score, roundsPlayed: round });

        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        // Get game summary for leaderboard
        const summary = getGameSummary();
        console.log('Game Summary:', summary);

        // Save to local storage for leaderboard
        saveToLeaderboard(summary);

        setTimeout(() => {
            elements.gameScreen.classList.remove('active');
            elements.gameoverScreen.classList.add('active');

            elements.gameoverStats.innerHTML = `
                <div class="stat-row">
                    <span>Seed:</span>
                    <span class="seed-code">${formatSeed(currentSeed)}</span>
                </div>
                <div class="stat-row">
                    <span>Rounds Survived:</span>
                    <span>${round}</span>
                </div>
                <div class="stat-row">
                    <span>Final Score:</span>
                    <span>${score}</span>
                </div>
                <div class="stat-row">
                    <span>Hostiles Destroyed:</span>
                    <span>${Math.floor(score / 2)}</span>
                </div>
                <div class="stat-row share-row">
                    <span>Challenge Friends:</span>
                    <button onclick="StationSiege.copySeed()" class="btn btn-secondary btn-small">
                        Copy Seed
                    </button>
                </div>
            `;
        }, 1000);
    }

    // =========================================================================
    // LEADERBOARD
    // =========================================================================

    function saveToLeaderboard(summary) {
        try {
            const key = `station_siege_scores_${summary.seed}`;
            let scores = JSON.parse(localStorage.getItem(key) || '[]');
            scores.push({
                player: summary.player,
                score: summary.finalScore,
                rounds: summary.roundsPlayed,
                timestamp: summary.timestamp
            });
            // Keep top 10 scores per seed
            scores.sort((a, b) => b.score - a.score);
            scores = scores.slice(0, 10);
            localStorage.setItem(key, JSON.stringify(scores));

            // Also save to all-time leaderboard
            let allTime = JSON.parse(localStorage.getItem('station_siege_alltime') || '[]');
            allTime.push({
                player: summary.player,
                score: summary.finalScore,
                rounds: summary.roundsPlayed,
                seed: summary.seed,
                timestamp: summary.timestamp
            });
            allTime.sort((a, b) => b.score - a.score);
            allTime = allTime.slice(0, 50);
            localStorage.setItem('station_siege_alltime', JSON.stringify(allTime));
        } catch (e) {
            console.log('Could not save to leaderboard:', e);
        }
    }

    function getLeaderboard(seed = null) {
        try {
            if (seed) {
                const key = `station_siege_scores_${seed}`;
                return JSON.parse(localStorage.getItem(key) || '[]');
            }
            return JSON.parse(localStorage.getItem('station_siege_alltime') || '[]');
        } catch (e) {
            return [];
        }
    }

    function copySeed() {
        const seedText = formatSeed(currentSeed);
        navigator.clipboard.writeText(seedText).then(() => {
            showAnnouncement(`SEED ${seedText} COPIED!`);
        }).catch(() => {
            showAnnouncement(`SEED: ${seedText}`);
        });
    }

    // =========================================================================
    // MULTIPLAYER FUNCTIONS
    // =========================================================================

    function initMultiplayer(socket, name) {
        multiplayerSocket = socket;
        playerName = name || 'Player';

        // Listen for multiplayer events
        socket.on('player_joined', (data) => {
            connectedPlayers = data.players;
            showAnnouncement(`${data.name} JOINED!`);
            updatePlayersDisplay();
        });

        socket.on('player_left', (data) => {
            connectedPlayers = data.players;
            showAnnouncement(`${data.name} LEFT`);
            updatePlayersDisplay();
        });

        socket.on('game_start_sync', (data) => {
            // Another player started the game - sync if in coop mode
            if (gameMode === 'coop' && !isHost) {
                startGame(data.seed);
            }
        });

        socket.on('dart_event', (data) => {
            // In coop mode, process dart throws from other players
            if (gameMode === 'coop' && data.player !== playerName && gameActive) {
                handleDartThrow(data.dart, data.player);
            }
        });

        socket.on('game_state_sync', (data) => {
            // Sync game state from host in coop mode
            if (gameMode === 'coop' && !isHost) {
                syncGameState(data);
            }
        });
    }

    function createRoom(roomCode) {
        if (!multiplayerSocket) return;
        multiplayerRoom = roomCode;
        isHost = true;
        multiplayerSocket.emit('create_room', { room: roomCode, player: playerName });
    }

    function joinRoom(roomCode) {
        if (!multiplayerSocket) return;
        multiplayerRoom = roomCode;
        isHost = false;
        multiplayerSocket.emit('join_room', { room: roomCode, player: playerName });
    }

    function setGameMode(mode) {
        gameMode = mode;
    }

    function setPlayerName(name) {
        playerName = name;
    }

    function updatePlayersDisplay() {
        const display = document.getElementById('players-list');
        if (display) {
            display.innerHTML = connectedPlayers.map(p =>
                `<span class="player-tag">${p}</span>`
            ).join('');
        }
    }

    function syncGameState(state) {
        // Sync shared state from host
        if (state.hostiles) hostiles = state.hostiles;
        if (state.armory) armory = state.armory;
        if (state.shields !== undefined) shields = state.shields;
        if (state.score !== undefined) score = state.score;
        if (state.round !== undefined) round = state.round;
        updateUI();
        updateArmoryDisplay();
    }

    function broadcastGameState() {
        if (multiplayerSocket && multiplayerRoom && isHost) {
            multiplayerSocket.emit('game_state', {
                room: multiplayerRoom,
                state: {
                    hostiles: hostiles,
                    armory: armory,
                    shields: shields,
                    score: score,
                    round: round
                }
            });
        }
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================

    function isGameActive() {
        return gameActive;
    }

    function getCurrentSeed() {
        return currentSeed;
    }

    return {
        startGame,
        handleDartThrow,
        isGameActive,
        getCurrentSeed,
        getLeaderboard,
        copySeed,
        getGameSummary,
        // Multiplayer
        initMultiplayer,
        createRoom,
        joinRoom,
        setGameMode,
        setPlayerName
    };
})();
