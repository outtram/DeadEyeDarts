/**
 * Dungeon of Darts - D&D Style Dungeon Crawler
 * Five heroes battle through a dungeon filled with ridiculous creatures
 * Now with MAGIC SPELLS and POWER-UPS!
 */

const DungeonCrawl = (function() {
    // =========================================================================
    // CONFIGURATION
    // =========================================================================

    const FLOORS = 3;
    const ROOMS_PER_FLOOR = 5;

    // Configurable settings (can be changed in-game)
    let gameConfig = {
        playerCount: 5,
        dartsPerTurn: 3,
        minCreatures: 1,
        maxCreatures: 3
    };

    // The Five Heroes - your mates!
    const HEROES = [
        {
            name: 'TROY',
            class: 'The Blade Master',
            icon: '⚔️',
            maxHP: 100,
            maxMana: 50,
            special: 'Critical Strike',
            specialDesc: 'Triples deal 3x damage!',
            spell: { name: 'BLADE FURY', icon: '🗡️', manaCost: 25, damage: 80, desc: 'Unleash a whirlwind of steel!' }
        },
        {
            name: 'DEANO',
            class: 'The Tank',
            icon: '🛡️',
            maxHP: 150,
            maxMana: 40,
            special: 'Shield Wall',
            specialDesc: 'Takes 50% less damage',
            spell: { name: 'FORTRESS', icon: '🏰', manaCost: 20, damage: 0, desc: 'Heal all heroes for 40 HP!' }
        },
        {
            name: 'DAVE',
            class: 'The Fire Mage',
            icon: '🔥',
            maxHP: 80,
            maxMana: 80,
            special: 'Fireball',
            specialDesc: 'Bullseye burns for bonus damage!',
            spell: { name: 'INFERNO', icon: '☄️', manaCost: 35, damage: 120, desc: 'Rain fire from the heavens!' }
        },
        {
            name: 'JACK',
            class: 'The Ranger',
            icon: '🏹',
            maxHP: 90,
            maxMana: 60,
            special: 'Precision Shot',
            specialDesc: 'Doubles always crit!',
            spell: { name: 'ARROW STORM', icon: '🎯', manaCost: 30, damage: 100, desc: 'A hail of deadly arrows!' }
        },
        {
            name: 'MICK',
            class: 'The Storm Caller',
            icon: '⚡',
            maxHP: 85,
            maxMana: 70,
            special: 'Chain Lightning',
            specialDesc: 'High numbers chain bonus!',
            spell: { name: 'THUNDERSTRIKE', icon: '⛈️', manaCost: 30, damage: 110, desc: 'Call down the thunder!' }
        }
    ];

    // Power-ups that can drop from monsters
    const POWERUPS = [
        { name: 'Health Potion', icon: '🧪', type: 'heal', value: 30, message: 'Restores 30 HP!' },
        { name: 'Mana Crystal', icon: '💎', type: 'mana', value: 25, message: 'Restores 25 Mana!' },
        { name: 'Mega Potion', icon: '⚗️', type: 'healAll', value: 20, message: 'Heals entire party for 20 HP!' },
        { name: 'Power Scroll', icon: '📜', type: 'damage', value: 50, message: 'Next attack deals +50 bonus damage!' },
        { name: 'Shield Rune', icon: '🔰', type: 'shield', value: 1, message: 'Blocks next monster attack!' },
        { name: 'Mana Fountain', icon: '🌊', type: 'manaAll', value: 15, message: 'Restores 15 Mana to all heroes!' },
        { name: 'Lucky Charm', icon: '🍀', type: 'gold', value: 50, message: 'Bonus 50 gold!' },
        { name: 'Ancient Tome', icon: '📖', type: 'spellBoost', value: 2, message: 'Spell damage doubled for next cast!' }
    ];

    // Ridiculous monster names and types
    const MONSTERS = {
        floor1: [
            { name: 'Barry the Confused Goblin', icon: '👺', hp: 60, damage: 15, gold: 20, dropChance: 0.4,
              taunt: "Wait, which end of the sword do I hold?" },
            { name: 'Kevin the Accountant Skeleton', icon: '💀', hp: 50, damage: 12, gold: 15, dropChance: 0.35,
              taunt: "Your taxes are OVERDUE!" },
            { name: 'Susan from HR (Zombie)', icon: '🧟', hp: 70, damage: 18, gold: 25, dropChance: 0.45,
              taunt: "Did you fill out the incident report?" },
            { name: 'Gary the Slime (Middle Management)', icon: '🟢', hp: 40, damage: 10, gold: 10, dropChance: 0.3,
              taunt: "Let's circle back on this attack..." },
            { name: 'Derek the Disappointed Dad Spider', icon: '🕷️', hp: 55, damage: 14, gold: 18, dropChance: 0.4,
              taunt: "I'm not angry, just disappointed." }
        ],
        floor2: [
            { name: 'Chad the Gym Bro Orc', icon: '👹', hp: 120, damage: 25, gold: 40, dropChance: 0.5,
              taunt: "Do you even LIFT, bro?!" },
            { name: 'Karen the Banshee', icon: '👻', hp: 90, damage: 30, gold: 45, dropChance: 0.45,
              taunt: "I WANT TO SPEAK TO YOUR DUNGEON MASTER!" },
            { name: 'Trevor the Troll (IT Support)', icon: '🧌', hp: 140, damage: 22, gold: 50, dropChance: 0.5,
              taunt: "Have you tried turning yourself off and on?" },
            { name: "Brenda's Book Club Basilisk", icon: '🐍', hp: 100, damage: 28, gold: 35, dropChance: 0.45,
              taunt: "This month we're reading... YOUR OBITUARY!" },
            { name: 'Uncle Terry the Drunk Minotaur', icon: '🐂', hp: 130, damage: 32, gold: 55, dropChance: 0.55,
              taunt: "Back in MY day, adventurers had RESPECT!" }
        ],
        floor3: [
            { name: 'Gerald the HOA Dragon', icon: '🐉', hp: 180, damage: 38, gold: 80, dropChance: 0.6,
              taunt: "Your lawn is 2mm too tall! PREPARE TO DIE!" },
            { name: 'Darren the Crypto Bro Demon', icon: '😈', hp: 160, damage: 35, gold: 70, dropChance: 0.55,
              taunt: "Have you heard about this thing called DungeonCoin?" },
            { name: 'Cheryl the PTA Vampire', icon: '🧛', hp: 150, damage: 33, gold: 65, dropChance: 0.55,
              taunt: "The bake sale needs YOUR BLOOD... I mean cookies!" },
            { name: "Big Dave's Evil Twin", icon: '👤', hp: 170, damage: 40, gold: 75, dropChance: 0.6,
              taunt: "I'm Dave but EVIL! And I use the WRONG BBQ sauce!" },
            { name: "Sharon (Everyone's Ex)", icon: '👸', hp: 200, damage: 42, gold: 100, dropChance: 0.7,
              taunt: "We need to TALK about our RELATIONSHIP!" }
        ]
    };

    // Boss for each floor
    const BOSSES = {
        1: { name: 'MEGA KAREN - Regional Manager of Pain', icon: '👩‍💼', hp: 200, damage: 30, gold: 100, dropChance: 1.0,
             taunt: "I've filed a complaint with the DARK LORD!", weakSpot: 20 },
        2: { name: 'BOOMER THE DESTROYER - Back In My Day...', icon: '👴', hp: 350, damage: 40, gold: 200, dropChance: 1.0,
             taunt: "You millennials wouldn't last ONE DAY in a REAL dungeon!", weakSpot: 19 },
        3: { name: 'THE MOTHER-IN-LAW - Final Form', icon: '👵', hp: 500, damage: 50, gold: 500, dropChance: 1.0,
             taunt: "Why can't you be more like your SISTER'S adventuring party?!", weakSpot: 18 }
    };

    // Combat messages
    const COMBAT_MESSAGES = {
        hit: [
            "{hero} lands a solid blow!",
            "{hero} strikes true!",
            "{hero} connects with deadly precision!",
            "{hero} smashes the target!",
            "THWACK! {hero} hits hard!"
        ],
        miss: [
            "{hero} swings wildly and misses!",
            "{hero}'s attack goes wide!",
            "{hero} trips over their own feet!",
            "{hero} hits nothing but air!",
            "The monster laughs at {hero}'s attempt!"
        ],
        critical: [
            "CRITICAL HIT! {hero} is on FIRE!",
            "{hero} finds the weak spot! DEVASTATING!",
            "BOOM! {hero} unleashes their full power!",
            "{hero} channels their inner legend!"
        ],
        kill: [
            "{monster} explodes into gold coins!",
            "{monster} lets out a final cry and dissolves!",
            "VICTORY! {monster} has been vanquished!",
            "{monster} drops to the ground defeated!"
        ],
        monsterAttack: [
            "{monster} strikes back at {hero}!",
            "{monster} retaliates with fury!",
            "{hero} takes a hit from {monster}!"
        ]
    };

    // =========================================================================
    // GAME STATE
    // =========================================================================

    let gameActive = false;
    let gamePaused = false;
    let currentFloor = 1;
    let currentRoom = 1;
    let currentHeroIndex = 0;
    let currentMonsters = [];  // Array of monsters (1-3)
    let partyGold = 0;
    let dartsRemaining = 3;    // Darts left for current hero

    let heroStates = [];
    let heroStats = [];
    let activeHeroes = [];     // Indices of active heroes based on player count

    // Power-up buffs
    let partyBuffs = {
        bonusDamage: 0,      // Extra damage on next hit
        shield: 0,           // Blocks next X attacks
        spellBoost: 1        // Multiplier for next spell
    };

    // DOM elements
    let elements = {};

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    function initElements() {
        elements = {
            titleScreen: document.getElementById('title-screen'),
            gameScreen: document.getElementById('game-screen'),
            victoryScreen: document.getElementById('victory-screen'),
            gameoverScreen: document.getElementById('gameover-screen'),
            currentFloor: document.getElementById('current-floor'),
            currentRoom: document.getElementById('current-room'),
            partyGold: document.getElementById('party-gold'),
            dungeonRoom: document.getElementById('dungeon-room'),
            monsterArena: document.getElementById('monster-arena'),
            targetIndicators: document.getElementById('target-indicators'),
            combatLog: document.getElementById('combat-log'),
            logEntries: document.getElementById('log-entries'),
            partyStatus: document.getElementById('party-status'),
            attackerName: document.getElementById('attacker-name'),
            attackerClass: document.getElementById('attacker-class'),
            dartsRemainingDisplay: document.getElementById('darts-remaining-display'),
            damageContainer: document.getElementById('damage-container'),
            victoryStats: document.getElementById('victory-stats'),
            heroScores: document.getElementById('hero-scores'),
            mvpSection: document.getElementById('mvp-section'),
            gameoverStats: document.getElementById('gameover-stats'),
            spellPanel: document.getElementById('spell-panel'),
            buffDisplay: document.getElementById('buff-display'),
            settingsModal: document.getElementById('settings-modal'),
            heroRoster: document.getElementById('hero-roster')
        };
    }

    function startGame() {
        if (!elements.titleScreen) initElements();

        // Read configuration from title screen
        readConfigFromUI();

        // Get custom hero names from inputs
        const heroInputs = document.querySelectorAll('.hero-name-input');
        const customNames = Array.from(heroInputs).map(input => input.value.toUpperCase() || HEROES[parseInt(input.closest('.hero-card').dataset.hero)].name);

        // Determine active heroes based on player count
        activeHeroes = [];
        for (let i = 0; i < gameConfig.playerCount; i++) {
            activeHeroes.push(i);
        }

        // Initialize hero states with mana (only active heroes)
        heroStates = activeHeroes.map(index => ({
            ...HEROES[index],
            name: customNames[index],
            hp: HEROES[index].maxHP,
            mana: HEROES[index].maxMana,
            alive: true
        }));

        // Initialize hero stats
        heroStats = activeHeroes.map(index => ({
            name: customNames[index],
            damageDealt: 0,
            kills: 0,
            criticals: 0,
            misses: 0,
            spellsCast: 0,
            goldEarned: 0
        }));

        // Reset game state
        gameActive = true;
        gamePaused = false;
        currentFloor = 1;
        currentRoom = 1;
        currentHeroIndex = 0;
        partyGold = 0;
        dartsRemaining = gameConfig.dartsPerTurn;
        partyBuffs = { bonusDamage: 0, shield: 0, spellBoost: 1 };

        // Switch screens
        elements.titleScreen.classList.remove('active');
        elements.gameScreen.classList.add('active');

        // Build party status UI
        buildPartyStatus();
        updateBuffDisplay();
        updateDartsDisplay();

        // Start first room
        enterRoom();

        addLogEntry("The party enters the Dungeon of Darts...", 'system');
        addLogEntry("Floor 1 - The Basement of Mild Inconvenience", 'system');
        addLogEntry(`💡 TIP: Each hero gets ${gameConfig.dartsPerTurn} darts per turn!`, 'tip');
        addLogEntry("💡 TIP: Hit BULLSEYE to cast your hero's spell!", 'tip');

        console.log('DungeonCrawl: Game started!');
    }

    function readConfigFromUI() {
        const playerCountEl = document.getElementById('player-count');
        const dartsPerTurnEl = document.getElementById('darts-per-turn');

        if (playerCountEl) {
            gameConfig.playerCount = parseInt(playerCountEl.textContent) || 5;
        }
        if (dartsPerTurnEl) {
            gameConfig.dartsPerTurn = parseInt(dartsPerTurnEl.textContent) || 3;
        }
    }

    // =========================================================================
    // ROOM & MONSTER MANAGEMENT
    // =========================================================================

    function enterRoom() {
        // Update UI
        elements.currentFloor.textContent = currentFloor;
        elements.currentRoom.textContent = currentRoom;
        elements.partyGold.textContent = partyGold;

        // Is this a boss room?
        const isBossRoom = currentRoom === ROOMS_PER_FLOOR;

        // Clear current monsters
        currentMonsters = [];

        // Get monster(s) for this room
        if (isBossRoom) {
            // Boss room - just one boss
            const boss = { ...BOSSES[currentFloor], id: 0 };
            boss.maxHP = boss.hp;
            currentMonsters.push(boss);
            addLogEntry(`⚠️ BOSS ROOM! ${boss.name} appears!`, 'boss');
        } else {
            // Random 1-3 creatures
            const creatureCount = Math.floor(Math.random() * (gameConfig.maxCreatures - gameConfig.minCreatures + 1)) + gameConfig.minCreatures;
            const floorMonsters = MONSTERS[`floor${currentFloor}`];

            for (let i = 0; i < creatureCount; i++) {
                const randomMonster = floorMonsters[Math.floor(Math.random() * floorMonsters.length)];
                const monster = {
                    ...randomMonster,
                    id: i,
                    weakSpot: Math.floor(Math.random() * 20) + 1
                };
                monster.maxHP = monster.hp;
                // Assign unique target number for each monster
                monster.currentTarget = getUniqueTarget(currentMonsters);
                currentMonsters.push(monster);
            }

            if (creatureCount === 1) {
                addLogEntry(`${currentMonsters[0].icon} ${currentMonsters[0].name} blocks the path!`, 'encounter');
            } else {
                addLogEntry(`${creatureCount} creatures appear!`, 'encounter');
                currentMonsters.forEach(m => {
                    addLogEntry(`  ${m.icon} ${m.name}`, 'encounter');
                });
            }
        }

        // Spawn monsters visually
        spawnMonsters(isBossRoom);

        // Update target indicators
        updateTargetIndicators();

        // Monster taunts (pick one random monster to taunt)
        const tauntingMonster = currentMonsters[Math.floor(Math.random() * currentMonsters.length)];
        setTimeout(() => {
            addLogEntry(`"${tauntingMonster.taunt}"`, 'taunt');
        }, 500);

        // Update current attacker
        updateCurrentAttacker();
        updateSpellPanel();
    }

    function getUniqueTarget(existingMonsters) {
        const usedTargets = existingMonsters.map(m => m.currentTarget);
        let target;
        let attempts = 0;
        do {
            target = Math.floor(Math.random() * 20) + 1;
            attempts++;
        } while (usedTargets.includes(target) && attempts < 50);
        return target;
    }

    function spawnMonsters(isBoss) {
        const arena = elements.monsterArena;
        arena.innerHTML = '';

        // Add class based on monster count for layout
        arena.className = `monster-arena monsters-${currentMonsters.length}`;

        currentMonsters.forEach((monster, index) => {
            const monsterEl = document.createElement('div');
            monsterEl.className = `monster ${isBoss ? 'boss' : ''} spawn-animation`;
            monsterEl.id = `monster-${monster.id}`;
            monsterEl.dataset.monsterId = monster.id;

            const hpPercent = (monster.hp / monster.maxHP) * 100;

            monsterEl.innerHTML = `
                <div class="monster-target-badge">HIT ${monster.currentTarget}</div>
                <div class="monster-icon">${monster.icon}</div>
                <div class="monster-name">${monster.name}</div>
                <div class="monster-hp-bar">
                    <div class="monster-hp-fill" style="width: ${hpPercent}%"></div>
                    <span class="monster-hp-text">${monster.hp} / ${monster.maxHP}</span>
                </div>
            `;

            arena.appendChild(monsterEl);

            // Remove spawn animation class after animation completes (staggered)
            setTimeout(() => monsterEl.classList.remove('spawn-animation'), 300 + (index * 200));
        });
    }

    // Keep old function name for compatibility
    function spawnMonster(isBoss) {
        spawnMonsters(isBoss);
    }

    function updateMonsterHP(monsterId = null) {
        // Update all monsters or specific one
        const monstersToUpdate = monsterId !== null
            ? currentMonsters.filter(m => m.id === monsterId)
            : currentMonsters;

        monstersToUpdate.forEach(monster => {
            const monsterEl = document.getElementById(`monster-${monster.id}`);
            if (!monsterEl) return;

            const hpFill = monsterEl.querySelector('.monster-hp-fill');
            const hpText = monsterEl.querySelector('.monster-hp-text');

            if (hpFill && hpText) {
                const hpPercent = Math.max(0, (monster.hp / monster.maxHP) * 100);
                hpFill.style.width = `${hpPercent}%`;
                hpText.textContent = `${Math.max(0, monster.hp)} / ${monster.maxHP}`;

                // Color change based on HP
                if (hpPercent < 25) {
                    hpFill.style.background = 'linear-gradient(90deg, #ff0000, #ff4444)';
                } else if (hpPercent < 50) {
                    hpFill.style.background = 'linear-gradient(90deg, #ff8800, #ffaa00)';
                }
            }
        });
    }

    function updateTargetIndicators() {
        if (!elements.targetIndicators) return;

        const livingMonsters = currentMonsters.filter(m => m.hp > 0);

        let html = '';
        livingMonsters.forEach(monster => {
            html += `
                <div class="target-indicator" data-monster-id="${monster.id}">
                    <span class="target-icon">${monster.icon}</span>
                    <span class="target-label">HIT</span>
                    <span class="target-number">${monster.currentTarget}</span>
                </div>
            `;
        });

        elements.targetIndicators.innerHTML = html;
    }

    // =========================================================================
    // COMBAT SYSTEM
    // =========================================================================

    function handleDartThrow(dart) {
        if (!gameActive || gamePaused || currentMonsters.length === 0) return;

        // Get living monsters
        const livingMonsters = currentMonsters.filter(m => m.hp > 0);
        if (livingMonsters.length === 0) return;

        const hero = heroStates[currentHeroIndex];
        if (!hero.alive) {
            nextHero();
            return;
        }

        const { segment, multiplier, value } = dart;
        const isBullseye = segment === 25 || segment === 0;

        console.log(`DungeonCrawl: ${hero.name} throws - ${segment} x${multiplier} (Dart ${gameConfig.dartsPerTurn - dartsRemaining + 1}/${gameConfig.dartsPerTurn})`);

        // Check for spell cast (Bullseye!)
        if (isBullseye && hero.mana >= hero.spell.manaCost) {
            castSpell(hero);
            dartsRemaining--;
            updateDartsDisplay();
            checkEndOfTurn();
            return;
        }

        // Find which monster was targeted (by matching target number)
        let targetMonster = livingMonsters.find(m => m.currentTarget === segment);

        // If no exact match, check for weak spots
        if (!targetMonster) {
            targetMonster = livingMonsters.find(m => m.weakSpot === segment);
        }

        // If still no match, damage goes to first living monster but reduced
        const hitSpecificTarget = !!targetMonster;
        if (!targetMonster) {
            targetMonster = livingMonsters[0];
        }

        const target = targetMonster.currentTarget;
        const isWeakSpot = segment === targetMonster.weakSpot;

        let damage = 0;
        let message = '';
        let messageType = 'combat';
        let isCritical = false;
        let isGoodHit = false;

        // Calculate damage based on hit
        if (segment === target || isWeakSpot) {
            // Direct hit on target or weak spot - GREAT HIT
            isGoodHit = true;
            damage = value * 2;
            if (isWeakSpot) {
                damage *= 2;
                isCritical = true;
                message = getRandomMessage('critical').replace('{hero}', hero.name);
                messageType = 'critical';
            } else {
                message = getRandomMessage('hit').replace('{hero}', hero.name);
            }
        } else if (hitSpecificTarget && Math.abs(segment - target) <= 2 && segment > 0 && segment <= 20) {
            // Close hit (within 2 numbers) - DECENT HIT
            isGoodHit = true;
            damage = Math.floor(value * 1.5);
            message = `${hero.name} grazes ${targetMonster.name}! Close enough!`;
        } else if (isBullseye) {
            // Bullseye but not enough mana - still good damage to random monster
            isGoodHit = true;
            const heroClass = HEROES.find(h => h.name === hero.name)?.class || '';
            damage = heroClass.includes('Fire') ? value * 3 : value * 2;
            message = heroClass.includes('Fire')
                ? `🔥 ${hero.name}'s FIREBALL! The bullseye erupts in flame!`
                : `${hero.name} hits the bullseye! (Not enough mana for spell)`;
            messageType = 'critical';
            isCritical = true;
            hero.mana = Math.min(hero.maxMana, hero.mana + 10);
            addLogEntry(`✨ +10 Mana restored!`, 'mana');
        } else if (multiplier === 3) {
            // Triple - bonus for Blade Master class
            isGoodHit = true;
            const heroClass = HEROES.find(h => h.name === hero.name)?.class || '';
            damage = heroClass.includes('Blade') ? value * 3 : value;
            if (heroClass.includes('Blade')) {
                message = `⚔️ ${hero.name}'s CRITICAL STRIKE! Triple damage unleashed!`;
                messageType = 'critical';
                isCritical = true;
            } else {
                message = `${hero.name} lands a powerful triple!`;
            }
        } else if (multiplier === 2) {
            // Double - bonus for Ranger class
            isGoodHit = true;
            const heroClass = HEROES.find(h => h.name === hero.name)?.class || '';
            damage = heroClass.includes('Ranger') ? value * 2 : value;
            if (heroClass.includes('Ranger')) {
                message = `🏹 ${hero.name}'s PRECISION SHOT! Double finds the mark!`;
                messageType = 'critical';
                isCritical = true;
            } else {
                message = `${hero.name} scores a double!`;
            }
        } else if (segment >= 15 && segment <= 20) {
            // High number - bonus for Storm Caller class
            isGoodHit = true;
            const heroClass = HEROES.find(h => h.name === hero.name)?.class || '';
            if (heroClass.includes('Storm')) {
                damage = Math.floor(value * 1.5);
                message = `⚡ ${hero.name}'s CHAIN LIGHTNING! High number chains bonus damage!`;
            } else {
                damage = value;
                message = `${hero.name} lands a solid hit!`;
            }
        } else if (segment >= 10 && segment <= 14) {
            // Medium numbers - still ok
            isGoodHit = true;
            damage = value;
            message = `${hero.name} hits for ${value}!`;
        } else {
            // Low numbers (1-9) or didn't hit any target - BAD HIT
            isGoodHit = false;
            damage = Math.floor(value * 0.5);
            message = getRandomMessage('miss').replace('{hero}', hero.name);
            messageType = 'miss';
            heroStats[currentHeroIndex].misses++;
        }

        // Apply bonus damage buff
        if (damage > 0 && partyBuffs.bonusDamage > 0) {
            damage += partyBuffs.bonusDamage;
            addLogEntry(`📜 Power Scroll adds +${partyBuffs.bonusDamage} damage!`, 'buff');
            partyBuffs.bonusDamage = 0;
            updateBuffDisplay();
        }

        // Apply damage to monster
        if (damage > 0) {
            targetMonster.hp -= damage;
            heroStats[currentHeroIndex].damageDealt += damage;
            if (isCritical) heroStats[currentHeroIndex].criticals++;

            // Show floating damage
            showFloatingDamage(damage, isCritical, false, targetMonster.id);

            // Shake monster on hit
            const monsterEl = document.getElementById(`monster-${targetMonster.id}`);
            if (monsterEl) {
                monsterEl.classList.add('hit-shake');
                setTimeout(() => monsterEl.classList.remove('hit-shake'), 300);
            }

            updateMonsterHP(targetMonster.id);
            addLogEntry(`${message} (${damage} damage to ${targetMonster.name})`, messageType);
        } else {
            addLogEntry(message, messageType);
        }

        // Check if this monster is dead
        if (targetMonster.hp <= 0) {
            monsterDefeated(targetMonster);
        } else {
            // Monster counter-attacks on BAD hits
            if (!isGoodHit) {
                monsterAttack(hero, targetMonster);
            }
        }

        // Decrement darts and check if turn is over
        dartsRemaining--;
        updateDartsDisplay();
        checkEndOfTurn();

        // Update UI
        buildPartyStatus();
        updateCurrentAttacker();
        updateSpellPanel();
        updateTargetIndicators();
    }

    function checkEndOfTurn() {
        // Check if all monsters are dead first
        const livingMonsters = currentMonsters.filter(m => m.hp > 0);
        if (livingMonsters.length === 0) {
            // Room cleared - will be handled by monsterDefeated
            return;
        }

        // Check if hero has used all darts
        if (dartsRemaining <= 0) {
            nextHero();
        }
    }

    function updateDartsDisplay() {
        if (!elements.dartsRemainingDisplay) return;

        let display = '';
        for (let i = 0; i < gameConfig.dartsPerTurn; i++) {
            if (i < dartsRemaining) {
                display += '🎯 ';
            } else {
                display += '⚫ ';
            }
        }
        elements.dartsRemainingDisplay.textContent = display.trim();

        // Also update in-game settings modal if open
        const dartsRemainingEl = document.getElementById('darts-remaining');
        if (dartsRemainingEl) {
            dartsRemainingEl.textContent = dartsRemaining;
        }
    }

    function castSpell(hero) {
        const spell = hero.spell;

        // Deduct mana
        hero.mana -= spell.manaCost;
        heroStats[currentHeroIndex].spellsCast++;

        // Calculate spell damage with boost
        let spellDamage = spell.damage * partyBuffs.spellBoost;

        addLogEntry(`✨ ${hero.name} casts ${spell.name}! ${spell.icon}`, 'spell');

        if (partyBuffs.spellBoost > 1) {
            addLogEntry(`📖 Ancient Tome DOUBLES the spell power!`, 'buff');
            partyBuffs.spellBoost = 1;
            updateBuffDisplay();
        }

        // Special spell effects
        if (spell.name === 'FORTRESS') {
            // Deano's heal spell
            heroStates.forEach(h => {
                if (h.alive) {
                    h.hp = Math.min(h.maxHP, h.hp + 40);
                }
            });
            addLogEntry(`🏰 FORTRESS heals all heroes for 40 HP!`, 'heal');
            showSpellEffect('heal');
        } else {
            // Damage spell - hits all monsters!
            const livingMonsters = currentMonsters.filter(m => m.hp > 0);
            const damagePerMonster = Math.floor(spellDamage / livingMonsters.length);

            livingMonsters.forEach(monster => {
                monster.hp -= damagePerMonster;
                heroStats[currentHeroIndex].damageDealt += damagePerMonster;

                showFloatingDamage(damagePerMonster, true, true, monster.id);

                // Shake monster
                const monsterEl = document.getElementById(`monster-${monster.id}`);
                if (monsterEl) {
                    monsterEl.classList.add('hit-shake');
                    setTimeout(() => monsterEl.classList.remove('hit-shake'), 500);
                }

                // Check if this monster died
                if (monster.hp <= 0) {
                    monsterDefeated(monster);
                }
            });

            showSpellEffect(hero.name.toLowerCase());
            addLogEntry(`${spell.icon} ${spell.desc} (${damagePerMonster} damage to each enemy!)`, 'spell');
            updateMonsterHP();
        }

        buildPartyStatus();
        updateSpellPanel();
        updateTargetIndicators();
    }

    function showSpellEffect(type) {
        const arena = elements.monsterArena;
        const effect = document.createElement('div');
        effect.className = `spell-effect ${type}`;

        switch(type) {
            case 'troy':
                effect.innerHTML = '🗡️⚔️🗡️';
                break;
            case 'deano':
                effect.innerHTML = '💚✨💚';
                break;
            case 'dave':
                effect.innerHTML = '🔥☄️🔥';
                break;
            case 'jack':
                effect.innerHTML = '🏹🎯🏹';
                break;
            case 'mick':
                effect.innerHTML = '⚡⛈️⚡';
                break;
            case 'heal':
                effect.innerHTML = '💚✨💚';
                break;
            default:
                effect.innerHTML = '✨';
        }

        arena.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    function monsterAttack(hero, monster = null) {
        // If no specific monster, pick a random living one
        if (!monster) {
            const livingMonsters = currentMonsters.filter(m => m.hp > 0);
            if (livingMonsters.length === 0) return;
            monster = livingMonsters[Math.floor(Math.random() * livingMonsters.length)];
        }

        // Check for shield buff
        if (partyBuffs.shield > 0) {
            partyBuffs.shield--;
            addLogEntry(`🔰 Shield Rune blocks the attack!`, 'buff');
            updateBuffDisplay();
            return;
        }

        let damage = monster.damage;

        // Tank class takes less damage
        const heroClass = HEROES.find(h => h.name === hero.name)?.class || '';
        if (heroClass.includes('Tank')) {
            damage = Math.floor(damage * 0.5);
            addLogEntry(`🛡️ ${hero.name}'s SHIELD WALL absorbs half the damage!`, 'special');
        }

        hero.hp -= damage;

        // Flash hero status red
        showHeroDamage(currentHeroIndex, damage);

        const attackMsg = getRandomMessage('monsterAttack')
            .replace('{monster}', monster.name)
            .replace('{hero}', hero.name);
        addLogEntry(`${attackMsg} (${damage} damage to ${hero.name})`, 'danger');

        // Check if hero is dead
        if (hero.hp <= 0) {
            hero.hp = 0;
            hero.alive = false;
            addLogEntry(`💀 ${hero.name} has fallen!`, 'death');

            // Check if all heroes are dead
            if (heroStates.every(h => !h.alive)) {
                gameOver();
            }
        }
    }

    function showHeroDamage(heroIndex, damage) {
        const heroCards = document.querySelectorAll('.hero-status');
        if (heroCards[heroIndex]) {
            heroCards[heroIndex].classList.add('taking-damage');
            setTimeout(() => heroCards[heroIndex].classList.remove('taking-damage'), 500);
        }
    }

    function monsterDefeated(monster) {
        const isBoss = currentRoom === ROOMS_PER_FLOOR;

        // Award gold
        const goldEarned = monster.gold;
        partyGold += goldEarned;
        heroStats[currentHeroIndex].goldEarned += goldEarned;
        heroStats[currentHeroIndex].kills++;

        // Death animation
        const monsterEl = document.getElementById(`monster-${monster.id}`);
        if (monsterEl) {
            monsterEl.classList.add('death-animation');
            // Remove monster element after animation
            setTimeout(() => monsterEl.remove(), 800);
        }

        const killMsg = getRandomMessage('kill').replace('{monster}', monster.name);
        addLogEntry(`${killMsg} (+${goldEarned} gold)`, 'victory');

        elements.partyGold.textContent = partyGold;

        // Check for power-up drop
        if (Math.random() < monster.dropChance) {
            setTimeout(() => dropPowerUp(), 800);
        }

        // Update target indicators
        updateTargetIndicators();

        // Check if all monsters in room are dead
        const livingMonsters = currentMonsters.filter(m => m.hp > 0);
        if (livingMonsters.length === 0) {
            // Room cleared!
            setTimeout(() => {
                if (isBoss) {
                    // Floor cleared
                    if (currentFloor >= FLOORS) {
                        // Game won!
                        victory();
                    } else {
                        // Next floor
                        currentFloor++;
                        currentRoom = 1;
                        addLogEntry(`🎉 FLOOR ${currentFloor - 1} CLEARED!`, 'victory');
                        addLogEntry(`Descending to Floor ${currentFloor}...`, 'system');

                        // Heal and restore mana between floors
                        heroStates.forEach(hero => {
                            if (hero.alive) {
                                hero.hp = Math.min(hero.maxHP, hero.hp + 40);
                                hero.mana = Math.min(hero.maxMana, hero.mana + 20);
                            }
                        });
                        addLogEntry(`The party rests: +40 HP, +20 Mana!`, 'heal');
                        buildPartyStatus();

                        // Reset darts for new room
                        dartsRemaining = gameConfig.dartsPerTurn;
                        updateDartsDisplay();

                        enterRoom();
                    }
                } else {
                    // Next room
                    currentRoom++;

                    // Reset darts for new room
                    dartsRemaining = gameConfig.dartsPerTurn;
                    updateDartsDisplay();

                    enterRoom();
                }
            }, 1200);
        }
    }

    function dropPowerUp() {
        const powerup = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];

        addLogEntry(`${powerup.icon} ${powerup.name} dropped! ${powerup.message}`, 'powerup');

        // Apply power-up effect
        switch(powerup.type) {
            case 'heal':
                const healTarget = heroStates.find(h => h.alive && h.hp < h.maxHP) || heroStates[currentHeroIndex];
                if (healTarget && healTarget.alive) {
                    healTarget.hp = Math.min(healTarget.maxHP, healTarget.hp + powerup.value);
                    addLogEntry(`${healTarget.name} drinks the potion! +${powerup.value} HP`, 'heal');
                }
                break;

            case 'mana':
                const manaTarget = heroStates.find(h => h.alive && h.mana < h.maxMana) || heroStates[currentHeroIndex];
                if (manaTarget && manaTarget.alive) {
                    manaTarget.mana = Math.min(manaTarget.maxMana, manaTarget.mana + powerup.value);
                    addLogEntry(`${manaTarget.name} absorbs the crystal! +${powerup.value} Mana`, 'mana');
                }
                break;

            case 'healAll':
                heroStates.forEach(h => {
                    if (h.alive) h.hp = Math.min(h.maxHP, h.hp + powerup.value);
                });
                addLogEntry(`All heroes healed for ${powerup.value} HP!`, 'heal');
                break;

            case 'manaAll':
                heroStates.forEach(h => {
                    if (h.alive) h.mana = Math.min(h.maxMana, h.mana + powerup.value);
                });
                addLogEntry(`All heroes gain ${powerup.value} Mana!`, 'mana');
                break;

            case 'damage':
                partyBuffs.bonusDamage = powerup.value;
                addLogEntry(`Next attack will deal +${powerup.value} bonus damage!`, 'buff');
                break;

            case 'shield':
                partyBuffs.shield = powerup.value;
                addLogEntry(`Shield will block the next monster attack!`, 'buff');
                break;

            case 'gold':
                partyGold += powerup.value;
                elements.partyGold.textContent = partyGold;
                addLogEntry(`Found ${powerup.value} bonus gold!`, 'gold');
                break;

            case 'spellBoost':
                partyBuffs.spellBoost = powerup.value;
                addLogEntry(`Next spell will deal DOUBLE damage!`, 'buff');
                break;
        }

        buildPartyStatus();
        updateBuffDisplay();
        updateSpellPanel();

        // Show floating powerup
        showFloatingPowerup(powerup);
    }

    function showFloatingPowerup(powerup) {
        const container = elements.damageContainer;
        const el = document.createElement('div');
        el.className = 'floating-powerup';
        el.innerHTML = `${powerup.icon}<br>${powerup.name}`;
        el.style.left = '50%';
        el.style.top = '40%';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    }

    function nextHero() {
        // Find next alive hero (only among active heroes)
        let attempts = 0;
        do {
            currentHeroIndex = (currentHeroIndex + 1) % heroStates.length;
            attempts++;
        } while (!heroStates[currentHeroIndex].alive && attempts < heroStates.length);

        // Reset darts for new hero
        dartsRemaining = gameConfig.dartsPerTurn;
        updateDartsDisplay();

        updateCurrentAttacker();
        updateSpellPanel();

        // Optionally shuffle monster targets for variety
        const livingMonsters = currentMonsters.filter(m => m.hp > 0);
        if (livingMonsters.length > 0) {
            // Reassign targets to keep it interesting (optional)
            livingMonsters.forEach(monster => {
                if (!monster.weakSpot) {
                    monster.currentTarget = getUniqueTarget(livingMonsters.filter(m => m.id !== monster.id));
                }
            });
            updateTargetIndicators();
            spawnMonsters(currentRoom === ROOMS_PER_FLOOR); // Refresh display
        }
    }

    // =========================================================================
    // UI UPDATES
    // =========================================================================

    function buildPartyStatus() {
        let html = '';
        heroStates.forEach((hero, index) => {
            const hpPercent = (hero.hp / hero.maxHP) * 100;
            const manaPercent = (hero.mana / hero.maxMana) * 100;
            const isActive = index === currentHeroIndex;
            const isDead = !hero.alive;

            html += `
                <div class="hero-status ${isActive ? 'active' : ''} ${isDead ? 'dead' : ''}">
                    <div class="hero-status-icon">${hero.icon}</div>
                    <div class="hero-status-info">
                        <div class="hero-status-name">${hero.name}</div>
                        <div class="hero-status-hp-bar">
                            <div class="hero-hp-fill" style="width: ${hpPercent}%"></div>
                        </div>
                        <div class="hero-status-mana-bar">
                            <div class="hero-mana-fill" style="width: ${manaPercent}%"></div>
                        </div>
                        <div class="hero-status-values">
                            <span class="hp-value">${hero.hp}/${hero.maxHP}</span>
                            <span class="mana-value">${hero.mana}/${hero.maxMana}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        elements.partyStatus.innerHTML = html;
    }

    function updateCurrentAttacker() {
        const hero = heroStates[currentHeroIndex];
        elements.attackerName.textContent = `${hero.icon} ${hero.name}`;
        elements.attackerClass.textContent = hero.class;

        // Highlight in party status
        document.querySelectorAll('.hero-status').forEach((el, index) => {
            el.classList.toggle('active', index === currentHeroIndex);
        });
    }

    function updateSpellPanel() {
        if (!elements.spellPanel) return;

        const hero = heroStates[currentHeroIndex];
        if (!hero || !hero.alive) {
            elements.spellPanel.innerHTML = '';
            return;
        }

        const canCast = hero.mana >= hero.spell.manaCost;
        elements.spellPanel.innerHTML = `
            <div class="spell-card ${canCast ? 'ready' : 'disabled'}">
                <div class="spell-icon">${hero.spell.icon}</div>
                <div class="spell-info">
                    <div class="spell-name">${hero.spell.name}</div>
                    <div class="spell-cost">${hero.spell.manaCost} Mana</div>
                    <div class="spell-desc">${hero.spell.desc}</div>
                </div>
                <div class="spell-hint">${canCast ? 'Hit BULLSEYE to cast!' : 'Need more mana!'}</div>
            </div>
        `;
    }

    function updateBuffDisplay() {
        if (!elements.buffDisplay) return;

        let buffs = [];
        if (partyBuffs.bonusDamage > 0) {
            buffs.push(`📜 +${partyBuffs.bonusDamage} dmg`);
        }
        if (partyBuffs.shield > 0) {
            buffs.push(`🔰 Shield`);
        }
        if (partyBuffs.spellBoost > 1) {
            buffs.push(`📖 2x Spell`);
        }

        elements.buffDisplay.innerHTML = buffs.length > 0
            ? `<div class="active-buffs">${buffs.join(' | ')}</div>`
            : '';
    }

    function showFloatingDamage(damage, isCritical, isSpell = false) {
        const container = elements.damageContainer;
        const damageEl = document.createElement('div');
        damageEl.className = `floating-damage ${isCritical ? 'critical' : ''} ${isSpell ? 'spell' : ''}`;
        damageEl.textContent = `-${damage}`;

        // Random position
        damageEl.style.left = `${40 + Math.random() * 20}%`;
        damageEl.style.top = `${20 + Math.random() * 20}%`;

        container.appendChild(damageEl);

        // Remove after animation
        setTimeout(() => damageEl.remove(), 1000);
    }

    function addLogEntry(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = message;

        elements.logEntries.appendChild(entry);
        elements.logEntries.scrollTop = elements.logEntries.scrollHeight;

        // Keep log from getting too long
        while (elements.logEntries.children.length > 50) {
            elements.logEntries.removeChild(elements.logEntries.firstChild);
        }
    }

    // =========================================================================
    // GAME END STATES
    // =========================================================================

    function victory() {
        gameActive = false;

        setTimeout(() => {
            elements.gameScreen.classList.remove('active');
            elements.victoryScreen.classList.add('active');

            // Build victory stats
            const totalSpells = heroStats.reduce((sum, h) => sum + h.spellsCast, 0);
            elements.victoryStats.innerHTML = `
                <div class="stat-row">
                    <span>Floors Cleared:</span>
                    <span>${FLOORS}</span>
                </div>
                <div class="stat-row">
                    <span>Rooms Conquered:</span>
                    <span>${FLOORS * ROOMS_PER_FLOOR}</span>
                </div>
                <div class="stat-row">
                    <span>Spells Cast:</span>
                    <span>✨ ${totalSpells}</span>
                </div>
                <div class="stat-row">
                    <span>Total Gold:</span>
                    <span>💰 ${partyGold}</span>
                </div>
            `;

            // Build hero scores
            let scoresHtml = '';
            const sortedStats = [...heroStats].sort((a, b) => b.damageDealt - a.damageDealt);
            sortedStats.forEach((stat, index) => {
                const hero = HEROES.find(h => h.name === stat.name);
                scoresHtml += `
                    <div class="hero-score-row ${index === 0 ? 'mvp' : ''}">
                        <span class="hero-score-icon">${hero.icon}</span>
                        <span class="hero-score-name">${stat.name}</span>
                        <span class="hero-score-damage">${stat.damageDealt} dmg</span>
                        <span class="hero-score-kills">${stat.kills} kills</span>
                        <span class="hero-score-spells">${stat.spellsCast} spells</span>
                    </div>
                `;
            });
            elements.heroScores.innerHTML = scoresHtml;

            // MVP section
            const mvp = sortedStats[0];
            const mvpHero = HEROES.find(h => h.name === mvp.name);
            elements.mvpSection.innerHTML = `
                <div class="mvp-card">
                    <div class="mvp-title">⭐ MVP - MOST VALUABLE PLAYER ⭐</div>
                    <div class="mvp-icon">${mvpHero.icon}</div>
                    <div class="mvp-name">${mvp.name}</div>
                    <div class="mvp-stats">${mvp.damageDealt} damage | ${mvp.kills} kills | ${mvp.spellsCast} spells</div>
                </div>
            `;
        }, 1000);
    }

    function gameOver() {
        gameActive = false;

        setTimeout(() => {
            elements.gameScreen.classList.remove('active');
            elements.gameoverScreen.classList.add('active');

            const killerMonster = currentMonsters.find(m => m.hp > 0) || currentMonsters[0];
            elements.gameoverStats.innerHTML = `
                <div class="stat-row">
                    <span>Reached Floor:</span>
                    <span>${currentFloor}</span>
                </div>
                <div class="stat-row">
                    <span>Rooms Cleared:</span>
                    <span>${(currentFloor - 1) * ROOMS_PER_FLOOR + currentRoom - 1}</span>
                </div>
                <div class="stat-row">
                    <span>Gold Collected:</span>
                    <span>💰 ${partyGold}</span>
                </div>
                <div class="stat-row">
                    <span>Defeated By:</span>
                    <span>${killerMonster?.name || 'Unknown'}</span>
                </div>
            `;
        }, 1000);
    }

    function resetGame() {
        // Reset all state
        gameActive = false;
        gamePaused = false;
        currentFloor = 1;
        currentRoom = 1;
        currentHeroIndex = 0;
        currentMonsters = [];
        partyGold = 0;
        dartsRemaining = gameConfig.dartsPerTurn;
        heroStates = [];
        heroStats = [];
        activeHeroes = [];
        partyBuffs = { bonusDamage: 0, shield: 0, spellBoost: 1 };

        // Clear log
        if (elements.logEntries) {
            elements.logEntries.innerHTML = '';
        }

        // Hide settings modal if open
        if (elements.settingsModal) {
            elements.settingsModal.classList.add('hidden');
        }

        // Switch screens
        elements.victoryScreen?.classList.remove('active');
        elements.gameoverScreen?.classList.remove('active');
        elements.gameScreen?.classList.remove('active');
        elements.titleScreen?.classList.add('active');
    }

    // =========================================================================
    // SETTINGS / PAUSE MENU
    // =========================================================================

    function toggleSettings() {
        if (!elements.settingsModal) return;

        if (elements.settingsModal.classList.contains('hidden')) {
            // Opening settings - pause game
            gamePaused = true;
            elements.settingsModal.classList.remove('hidden');

            // Update settings display
            const igDartsEl = document.getElementById('ig-darts-per-turn');
            if (igDartsEl) igDartsEl.textContent = gameConfig.dartsPerTurn;

            const dartsRemainingEl = document.getElementById('darts-remaining');
            if (dartsRemainingEl) dartsRemainingEl.textContent = dartsRemaining;

            const heroNameEl = document.getElementById('current-hero-name');
            if (heroNameEl && heroStates[currentHeroIndex]) {
                heroNameEl.textContent = heroStates[currentHeroIndex].name;
            }
        } else {
            // Closing settings - resume game
            gamePaused = false;
            elements.settingsModal.classList.add('hidden');
        }
    }

    function updateInGameDarts(delta) {
        const newValue = Math.max(1, Math.min(3, gameConfig.dartsPerTurn + delta));
        gameConfig.dartsPerTurn = newValue;

        const igDartsEl = document.getElementById('ig-darts-per-turn');
        if (igDartsEl) igDartsEl.textContent = newValue;

        // Also update title screen if we go back
        const titleDartsEl = document.getElementById('darts-per-turn');
        if (titleDartsEl) titleDartsEl.textContent = newValue;
    }

    // =========================================================================
    // UTILITIES
    // =========================================================================

    function getRandomMessage(type) {
        const messages = COMBAT_MESSAGES[type];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function isGameActive() {
        return gameActive;
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================

    return {
        startGame,
        handleDartThrow,
        resetGame,
        isGameActive,
        toggleSettings,
        updateInGameDarts
    };
})();
