/**
 * HEIST CREW - Cooperative 3-Player Cyberpunk Heist Game
 *
 * Game Mechanics:
 * - 3 players with unique roles (Hacker, Infiltrator, Demolitions)
 * - 5 escalating heist missions with story progression
 * - Time-based challenges with alert level system
 * - Role-specific abilities and bonuses
 * - Cooperative gameplay with player rotation
 *
 * Roles:
 * - Hacker: Doubles give 2x time bonus, can bypass security
 * - Infiltrator: Triples count as instant success, stealth bonuses
 * - Demolitions: Bullseye triggers explosive bonus, high risk/reward
 */

const HeistGame = (function() {
    // Game state
    let gameActive = false;
    let gamePaused = false;
    let currentMissionId = null;
    let currentMission = null;

    // Players
    let players = []; // {name, role, roleIcon, score, abilityUsed}
    let activePlayerIndex = 0;

    // Mission state
    let timeRemaining = 0;
    let alertLevel = 0;
    let missionProgress = 0;
    let missionGoal = 0;
    let dartsThrown = 0;

    // Mission-specific data
    let sequenceTarget = []; // For sequence missions
    let sequenceProgress = 0;

    // Timers
    let gameTimer = null;
    let startTime = 0;

    // Progression
    let crewRep = 0;
    let unlockedMissions = ['vault'];
    let completedMissions = [];

    // Role definitions
    const ROLES = {
        hacker: {
            name: 'HACKER',
            icon: '💻',
            description: 'Doubles give 2x time bonus',
            ability: 'System Bypass'
        },
        infiltrator: {
            name: 'INFILTRATOR',
            icon: '🥷',
            description: 'Triples count as instant success',
            ability: 'Stealth Mode'
        },
        demolitions: {
            name: 'DEMOLITIONS',
            icon: '💣',
            description: 'Bullseye triggers explosive bonus',
            ability: 'Explosive Charge'
        }
    };

    // Mission definitions
    const MISSIONS = {
        vault: {
            id: 'vault',
            name: 'THE VAULT JOB',
            number: 'MISSION 01',
            timeLimit: 180, // 3 minutes
            difficulty: 1,
            story: "The Central City Bank vault contains millions in untraceable credits. Your Hacker has cracked the security system and narrowed the combination down to three numbers. Hit them in sequence before the guards complete their patrol route. Time is critical - every second counts!",
            objectives: [
                "Crack the vault combination (3 specific numbers in sequence)",
                "Each crew member takes turns throwing",
                "Wrong numbers increase alert level by 10%",
                "Complete sequence before timer expires"
            ],
            type: 'sequence',
            goal: 3, // 3 numbers in sequence
            generateTargets: function() {
                // Generate 3 random unique numbers
                const numbers = [];
                while (numbers.length < 3) {
                    const num = Math.floor(Math.random() * 20) + 1;
                    if (!numbers.includes(num)) {
                        numbers.push(num);
                    }
                }
                return numbers;
            },
            tips: [
                "Work together - communicate which numbers you're aiming for!",
                "Hackers get bonus time from doubles - use it wisely!",
                "Watch your alert level - too many misses and it's over!"
            ]
        },

        databreach: {
            id: 'databreach',
            name: 'DATA BREACH',
            number: 'MISSION 02',
            timeLimit: 240, // 4 minutes
            difficulty: 2,
            story: "MegaCorp's mainframe holds the encryption keys to the city's financial network. Your crew needs to hack 12 vulnerable servers - all marked with odd numbers. Even-numbered servers have advanced firewalls that will trigger lockdown protocols. The Infiltrator's precision will be crucial here.",
            objectives: [
                "Hack 12 servers by hitting odd numbers only (1,3,5,7,9,11,13,15,17,19)",
                "Even numbers trigger firewall (+15% alert)",
                "Hackers: Doubles on odd numbers count as 2 servers",
                "Infiltrators: Triples instantly complete the objective"
            ],
            type: 'target_count',
            goal: 12,
            validNumbers: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
            tips: [
                "Odd numbers only! Even = bad news!",
                "Infiltrator triples are your ace in the hole",
                "Hackers can double your progress with... doubles!"
            ]
        },

        diamond: {
            id: 'diamond',
            name: 'DIAMOND DISTRICT',
            number: 'MISSION 03',
            timeLimit: 300, // 5 minutes
            difficulty: 3,
            story: "The Diamond District vault houses the rarest gems in the city, each worth a fortune. Your crew needs to steal $50,000 worth of diamonds from the high-security cases marked 15-20. Lower-numbered cases are decoys rigged with alarms. The Demolitions expert can use explosive charges to clear multiple cases at once!",
            objectives: [
                "Steal $50,000 worth of diamonds",
                "Hit segments 15-20 only (value × multiplier × $100)",
                "Segments below 15 trigger alarms (+5% alert)",
                "Triples in the 15-20 zone earn bonus $500",
                "Bullseye (25): Explosive bonus $2000!"
            ],
            type: 'point_threshold',
            goal: 50000,
            validRange: [15, 16, 17, 18, 19, 20],
            tips: [
                "High numbers = high value! Aim for 15-20!",
                "Triples are worth the risk for that bonus",
                "Demolitions bullseye = jackpot!"
            ]
        },

        casino: {
            id: 'casino',
            name: 'CASINO ROYALE',
            number: 'MISSION 04',
            timeLimit: 300, // 5 minutes
            difficulty: 4,
            story: "The Neon Palace Casino runs a rigged operation, and your crew is here to beat the house. You need to win big at their 'Lucky Seven' table by hitting multiples of 7 and hitting exactly 7 itself. The casino's security AI is watching - patterns matter. Can your crew outsmart the system?",
            objectives: [
                "Score 30 successful hits on target numbers",
                "Valid targets: 7, 14 (7×2), and all triples (3× multiplier)",
                "Singles on 7 count as 1 success",
                "Doubles on 14 count as 2 successes",
                "Any triple counts as 3 successes",
                "Wrong numbers increase alert by 8%"
            ],
            type: 'pattern_match',
            goal: 30,
            tips: [
                "Sevens and doubles of seven are your friends",
                "Triples on ANYTHING = 3 successes!",
                "Mix your targets to avoid detection patterns"
            ]
        },

        bigscore: {
            id: 'bigscore',
            name: 'THE BIG SCORE',
            number: 'MISSION 05',
            timeLimit: 360, // 6 minutes
            difficulty: 5,
            story: "This is it - the heist of a lifetime. The Platinum Reserve holds untold wealth, but getting to it requires cracking three security layers: the vault combination, the server firewall, AND the diamond laser grid. Your crew will need to use every skill you've learned. Failure means the end of your crew. Success means legend status. Are you ready?",
            objectives: [
                "Phase 1: Hit sequence 7, 14, 20 in order",
                "Phase 2: Hit 8 odd numbers (server hack)",
                "Phase 3: Accumulate $30,000 from segments 15-20",
                "Complete all phases before time expires",
                "Alert level carries between phases!"
            ],
            type: 'multi_phase',
            phases: [
                { type: 'sequence', goal: [7, 14, 20], progress: 0 },
                { type: 'odd_count', goal: 8, progress: 0 },
                { type: 'high_value', goal: 30000, progress: 0 }
            ],
            currentPhase: 0,
            tips: [
                "This is everything you've learned combined!",
                "Stay calm and communicate with your crew",
                "Every role matters - work together!",
                "Don't rush - precision over speed!"
            ]
        }
    };

    /**
     * Initialize game from localStorage
     */
    function loadProgress() {
        const saved = localStorage.getItem('heist_crew_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                crewRep = data.crewRep || 0;
                unlockedMissions = data.unlockedMissions || ['vault'];
                completedMissions = data.completedMissions || [];
            } catch (e) {
                console.error('Failed to load progress:', e);
            }
        }
    }

    /**
     * Save game progress to localStorage
     */
    function saveProgress() {
        const data = {
            crewRep: crewRep,
            unlockedMissions: unlockedMissions,
            completedMissions: completedMissions
        };
        localStorage.setItem('heist_crew_progress', JSON.stringify(data));
    }

    /**
     * Setup crew with player names
     */
    function setupCrew(playerNames) {
        console.log('Setting up crew:', playerNames);

        // Create player objects
        players = [
            {
                name: playerNames[0],
                role: 'hacker',
                roleIcon: ROLES.hacker.icon,
                roleName: ROLES.hacker.name,
                score: 0,
                abilityUsed: false
            },
            {
                name: playerNames[1],
                role: 'infiltrator',
                roleIcon: ROLES.infiltrator.icon,
                roleName: ROLES.infiltrator.name,
                score: 0,
                abilityUsed: false
            },
            {
                name: playerNames[2],
                role: 'demolitions',
                roleIcon: ROLES.demolitions.icon,
                roleName: ROLES.demolitions.name,
                score: 0,
                abilityUsed: false
            }
        ];

        // Load progress
        loadProgress();

        // Show mission select screen
        showMissionSelect();
    }

    /**
     * Show mission select screen
     */
    function showMissionSelect() {
        console.log('Showing mission select screen');

        hideAllScreens();
        document.getElementById('mission-select-screen').style.display = 'block';

        // Update crew roster
        document.getElementById('crew-member-1').textContent = `${players[0].roleIcon} ${players[0].name}`;
        document.getElementById('crew-member-2').textContent = `${players[1].roleIcon} ${players[1].name}`;
        document.getElementById('crew-member-3').textContent = `${players[2].roleIcon} ${players[2].name}`;

        // Update stats
        document.getElementById('crew-rep').textContent = crewRep;
        document.getElementById('missions-completed').textContent = `${completedMissions.length}/5`;

        // Update mission cards
        updateMissionCards();
    }

    /**
     * Update mission card states (locked/unlocked)
     */
    function updateMissionCards() {
        const missionCards = document.querySelectorAll('.mission-card');

        missionCards.forEach(card => {
            const missionId = card.dataset.mission;
            const btn = card.querySelector('.mission-select-btn');

            if (unlockedMissions.includes(missionId)) {
                card.classList.remove('locked');
                card.classList.add('unlocked');
                btn.disabled = false;
                btn.textContent = completedMissions.includes(missionId) ? 'REPLAY' : 'START HEIST';
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-success');
            } else {
                card.classList.remove('unlocked');
                card.classList.add('locked');
                btn.disabled = true;
                btn.textContent = 'LOCKED';
                btn.classList.remove('btn-success');
                btn.classList.add('btn-secondary');
            }
        });
    }

    /**
     * Show mission briefing
     */
    function showMissionBriefing(missionId) {
        console.log('Showing briefing for mission:', missionId);

        currentMissionId = missionId;
        currentMission = MISSIONS[missionId];

        hideAllScreens();
        document.getElementById('mission-briefing-screen').style.display = 'block';

        // Populate briefing
        document.getElementById('briefing-title').textContent = currentMission.name;
        document.getElementById('briefing-mission-number').textContent = currentMission.number;
        document.getElementById('briefing-story-text').textContent = currentMission.story;
        document.getElementById('briefing-time').textContent = formatTime(currentMission.timeLimit);

        // Populate objectives
        const objectivesList = document.getElementById('briefing-objectives-list');
        objectivesList.innerHTML = '';
        currentMission.objectives.forEach(obj => {
            const li = document.createElement('li');
            li.textContent = obj;
            objectivesList.appendChild(li);
        });
    }

    /**
     * Start the mission
     */
    function startMission() {
        console.log('Starting mission:', currentMissionId);

        // Reset mission state
        gameActive = true;
        gamePaused = false;
        activePlayerIndex = 0;
        timeRemaining = currentMission.timeLimit;
        alertLevel = 0;
        missionProgress = 0;
        missionGoal = currentMission.goal;
        dartsThrown = 0;
        startTime = Date.now();

        // Reset player scores and abilities
        players.forEach(p => {
            p.score = 0;
            p.abilityUsed = false;
        });

        // Mission-specific initialization
        if (currentMission.type === 'sequence') {
            sequenceTarget = currentMission.generateTargets();
            sequenceProgress = 0;
        } else if (currentMission.type === 'multi_phase') {
            currentMission.currentPhase = 0;
            currentMission.phases.forEach(phase => phase.progress = 0);
        }

        // Show active heist screen
        hideAllScreens();
        document.getElementById('active-heist-screen').style.display = 'block';

        // Update HUD
        updateHUD();
        updateCrewHUD();
        updateActivePlayer();

        // Start timer
        startGameTimer();

        // Show start message
        showOverlayMessage('HEIST STARTED!', 'success', 2000);
        addToFeed('🚨 HEIST INITIATED! Good luck, crew!', 'system');
    }

    /**
     * Start game timer
     */
    function startGameTimer() {
        if (gameTimer) clearInterval(gameTimer);

        gameTimer = setInterval(() => {
            if (!gameActive || gamePaused) return;

            timeRemaining--;
            updateTimer();

            // Check for time-based events
            if (timeRemaining === 30) {
                showOverlayMessage('30 SECONDS!', 'warning', 1500);
                addToFeed('⚠️ 30 seconds remaining! Escape timer activated!', 'warning');
            }

            if (timeRemaining <= 0) {
                endMission(false, 'Time ran out!');
            }
        }, 1000);
    }

    /**
     * Handle dart throw
     */
    function handleDartThrow(dart) {
        if (!gameActive || gamePaused) return;

        const segment = dart.segment;
        const multiplier = dart.multiplier;
        const value = dart.value;

        console.log(`Dart thrown: ${segment} x${multiplier} = ${value}`);

        dartsThrown++;
        const activePlayer = players[activePlayerIndex];

        // Process based on mission type
        let success = false;
        let message = '';
        let points = 0;

        if (currentMission.type === 'sequence') {
            success = processSequenceMission(segment, multiplier, activePlayer);
        } else if (currentMission.type === 'target_count') {
            success = processTargetCountMission(segment, multiplier, activePlayer);
        } else if (currentMission.type === 'point_threshold') {
            const result = processPointThresholdMission(segment, multiplier, value, activePlayer);
            success = result.success;
            points = result.points;
        } else if (currentMission.type === 'pattern_match') {
            const result = processPatternMatchMission(segment, multiplier, activePlayer);
            success = result.success;
            points = result.points;
        } else if (currentMission.type === 'multi_phase') {
            success = processMultiPhaseMission(segment, multiplier, value, activePlayer);
        }

        // Update HUD
        updateHUD();
        updateCrewHUD();

        // Rotate to next player
        rotatePlayer();

        // Check for mission complete
        if (missionProgress >= missionGoal) {
            endMission(true, 'Objective complete!');
        }

        // Check for alert level failure
        if (alertLevel >= 100) {
            endMission(false, 'Alert level reached 100%!');
        }
    }

    /**
     * Process sequence mission (vault)
     */
    function processSequenceMission(segment, multiplier, player) {
        const targetNumber = sequenceTarget[sequenceProgress];

        if (segment === targetNumber) {
            sequenceProgress++;
            missionProgress = sequenceProgress;

            const basePoints = 100 * multiplier;
            player.score += basePoints;

            addToFeed(`✓ ${player.roleIcon} ${player.name} hit ${segment}! Combination progress: ${sequenceProgress}/${sequenceTarget.length}`, 'success');
            showOverlayMessage(`${segment} CORRECT!`, 'success', 1000);

            // Hacker ability: doubles give time bonus
            if (player.role === 'hacker' && multiplier === 2) {
                timeRemaining += 10;
                addToFeed(`⚡ HACKER BONUS: +10 seconds!`, 'ability');
            }

            // Infiltrator ability: triples = instant complete
            if (player.role === 'infiltrator' && multiplier === 3) {
                sequenceProgress = sequenceTarget.length;
                missionProgress = sequenceProgress;
                addToFeed(`🥷 INFILTRATOR SPECIAL: Sequence auto-completed!`, 'ability');
                showOverlayMessage('INFILTRATOR MIRACLE!', 'success', 1500);
            }

            return true;
        } else {
            alertLevel += 10;
            if (alertLevel > 100) alertLevel = 100;

            addToFeed(`✗ ${player.roleIcon} ${player.name} hit ${segment}, needed ${targetNumber}. Alert +10%!`, 'miss');
            showOverlayMessage('WRONG NUMBER!', 'error', 1000);

            return false;
        }
    }

    /**
     * Process target count mission (databreach)
     */
    function processTargetCountMission(segment, multiplier, player) {
        const validNumbers = currentMission.validNumbers;

        if (validNumbers.includes(segment)) {
            let serversHacked = 1;

            // Hacker ability: doubles count as 2
            if (player.role === 'hacker' && multiplier === 2) {
                serversHacked = 2;
                addToFeed(`⚡ HACKER BONUS: Double hack! +2 servers!`, 'ability');
            }

            // Infiltrator ability: triples = instant complete
            if (player.role === 'infiltrator' && multiplier === 3) {
                missionProgress = missionGoal;
                addToFeed(`🥷 INFILTRATOR SPECIAL: All servers hacked!`, 'ability');
                showOverlayMessage('SYSTEM BREACH!', 'success', 1500);
                return true;
            }

            missionProgress += serversHacked;
            if (missionProgress > missionGoal) missionProgress = missionGoal;

            const basePoints = 50 * multiplier * serversHacked;
            player.score += basePoints;

            addToFeed(`✓ ${player.roleIcon} ${player.name} hacked server ${segment}! Progress: ${missionProgress}/${missionGoal}`, 'success');
            showOverlayMessage('SERVER HACKED!', 'success', 800);

            return true;
        } else {
            alertLevel += 15;
            if (alertLevel > 100) alertLevel = 100;

            addToFeed(`✗ ${player.roleIcon} ${player.name} hit firewall! Alert +15%!`, 'miss');
            showOverlayMessage('FIREWALL!', 'error', 1000);

            return false;
        }
    }

    /**
     * Process point threshold mission (diamond)
     */
    function processPointThresholdMission(segment, multiplier, value, player) {
        const validRange = currentMission.validRange;

        // Check for bullseye (demolitions ability)
        if (segment === 25) {
            if (player.role === 'demolitions') {
                const bonus = 2000;
                missionProgress += bonus;
                player.score += bonus;
                addToFeed(`💣 DEMOLITIONS SPECIAL: EXPLOSIVE BONUS! +$2000!`, 'ability');
                showOverlayMessage('KABOOM! $2000!', 'success', 1500);
                return { success: true, points: bonus };
            } else {
                const bonus = 500;
                missionProgress += bonus;
                player.score += bonus;
                addToFeed(`🎯 Bullseye! +$500!`, 'success');
                showOverlayMessage('BULLSEYE! $500!', 'success', 1000);
                return { success: true, points: bonus };
            }
        }

        if (validRange.includes(segment)) {
            let points = value * 100;

            // Triple bonus
            if (multiplier === 3) {
                points += 500;
                addToFeed(`⚡ Triple bonus! +$500!`, 'success');
            }

            missionProgress += points;
            player.score += points;

            addToFeed(`✓ ${player.roleIcon} ${player.name} stole diamonds worth $${points}! Total: $${missionProgress}/$${missionGoal}`, 'success');
            showOverlayMessage(`+$${points}`, 'success', 800);

            return { success: true, points: points };
        } else {
            alertLevel += 5;
            if (alertLevel > 100) alertLevel = 100;

            addToFeed(`✗ ${player.roleIcon} ${player.name} triggered alarm! Alert +5%!`, 'miss');
            showOverlayMessage('ALARM!', 'error', 1000);

            return { success: false, points: 0 };
        }
    }

    /**
     * Process pattern match mission (casino)
     */
    function processPatternMatchMission(segment, multiplier, player) {
        let successCount = 0;
        let points = 0;

        // Check for valid patterns
        if (segment === 7 && multiplier === 1) {
            // Single 7
            successCount = 1;
            points = 100;
            addToFeed(`✓ ${player.roleIcon} ${player.name} hit lucky 7! +1 success`, 'success');
        } else if (segment === 7 && multiplier === 2) {
            // Double 7 (14)
            successCount = 2;
            points = 200;
            addToFeed(`✓ ${player.roleIcon} ${player.name} hit double 7! +2 successes`, 'success');
        } else if (multiplier === 3) {
            // Any triple
            successCount = 3;
            points = 300;
            addToFeed(`✓ ${player.roleIcon} ${player.name} hit triple ${segment}! +3 successes`, 'success');
            showOverlayMessage('TRIPLE!', 'success', 1000);
        } else {
            // Wrong pattern
            alertLevel += 8;
            if (alertLevel > 100) alertLevel = 100;
            addToFeed(`✗ ${player.roleIcon} ${player.name} wrong pattern! Alert +8%!`, 'miss');
            showOverlayMessage('WRONG!', 'error', 800);
            return { success: false, points: 0 };
        }

        missionProgress += successCount;
        player.score += points;

        // Infiltrator ability: triples = instant complete
        if (player.role === 'infiltrator' && multiplier === 3) {
            missionProgress = missionGoal;
            addToFeed(`🥷 INFILTRATOR SPECIAL: Casino defeated!`, 'ability');
            showOverlayMessage('JACKPOT!', 'success', 1500);
        }

        return { success: true, points: points };
    }

    /**
     * Process multi-phase mission (bigscore)
     */
    function processMultiPhaseMission(segment, multiplier, value, player) {
        const phase = currentMission.phases[currentMission.currentPhase];
        let success = false;

        if (phase.type === 'sequence') {
            const targetIndex = phase.progress;
            if (targetIndex < phase.goal.length && segment === phase.goal[targetIndex]) {
                phase.progress++;
                player.score += 100 * multiplier;
                addToFeed(`✓ Phase 1: Hit ${segment}! Progress: ${phase.progress}/${phase.goal.length}`, 'success');
                success = true;

                if (phase.progress >= phase.goal.length) {
                    currentMission.currentPhase++;
                    addToFeed(`🎯 PHASE 1 COMPLETE! Moving to Phase 2...`, 'system');
                    showOverlayMessage('PHASE 1 DONE!', 'success', 1500);
                }
            } else {
                alertLevel += 10;
                addToFeed(`✗ Phase 1: Wrong number!`, 'miss');
            }
        } else if (phase.type === 'odd_count') {
            if ([1,3,5,7,9,11,13,15,17,19].includes(segment)) {
                phase.progress++;
                player.score += 50 * multiplier;
                addToFeed(`✓ Phase 2: Server hacked! Progress: ${phase.progress}/${phase.goal}`, 'success');
                success = true;

                if (phase.progress >= phase.goal) {
                    currentMission.currentPhase++;
                    addToFeed(`🎯 PHASE 2 COMPLETE! Moving to Phase 3...`, 'system');
                    showOverlayMessage('PHASE 2 DONE!', 'success', 1500);
                }
            } else {
                alertLevel += 12;
                addToFeed(`✗ Phase 2: Firewall triggered!`, 'miss');
            }
        } else if (phase.type === 'high_value') {
            if ([15,16,17,18,19,20].includes(segment)) {
                const points = value * 100;
                phase.progress += points;
                player.score += points;
                addToFeed(`✓ Phase 3: +$${points}! Total: $${phase.progress}/$${phase.goal}`, 'success');
                success = true;

                if (phase.progress >= phase.goal) {
                    missionProgress = 1;
                    missionGoal = 1;
                    addToFeed(`🎯 PHASE 3 COMPLETE! THE BIG SCORE IS YOURS!`, 'system');
                    showOverlayMessage('ALL PHASES DONE!', 'success', 2000);
                }
            } else {
                alertLevel += 8;
                addToFeed(`✗ Phase 3: Wrong case!`, 'miss');
            }
        }

        if (alertLevel > 100) alertLevel = 100;
        return success;
    }

    /**
     * Rotate to next player
     */
    function rotatePlayer() {
        activePlayerIndex = (activePlayerIndex + 1) % players.length;
        updateActivePlayer();
    }

    /**
     * Update HUD
     */
    function updateHUD() {
        // Update timer
        updateTimer();

        // Update alert level
        document.getElementById('alert-fill').style.width = alertLevel + '%';
        document.getElementById('alert-percentage').textContent = Math.floor(alertLevel) + '%';

        const alertBar = document.querySelector('.alert-bar');
        if (alertLevel >= 70) {
            alertBar.classList.add('critical');
        } else {
            alertBar.classList.remove('critical');
        }

        // Update objective
        updateObjectiveDisplay();

        // Update team score
        const teamScore = players.reduce((sum, p) => sum + p.score, 0);
        document.getElementById('team-score').textContent = teamScore;
    }

    /**
     * Update timer display
     */
    function updateTimer() {
        const timerDisplay = document.getElementById('timer');
        timerDisplay.textContent = formatTime(timeRemaining);

        const timerContainer = document.querySelector('.timer-container');
        if (timeRemaining <= 30) {
            timerContainer.classList.add('critical');
        } else if (timeRemaining <= 60) {
            timerContainer.classList.add('warning');
        } else {
            timerContainer.classList.remove('warning', 'critical');
        }
    }

    /**
     * Update objective display based on mission type
     */
    function updateObjectiveDisplay() {
        const objectiveDiv = document.getElementById('current-objective');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (currentMission.type === 'sequence') {
            const target = sequenceTarget[sequenceProgress] || '?';
            objectiveDiv.textContent = `Hit the combination: ${sequenceTarget.map((n, i) => i < sequenceProgress ? `✓${n}` : i === sequenceProgress ? n : '?').join(' → ')}`;
            const percent = (sequenceProgress / sequenceTarget.length) * 100;
            progressFill.style.width = percent + '%';
            progressText.textContent = `${sequenceProgress} / ${sequenceTarget.length}`;
        } else if (currentMission.type === 'target_count') {
            objectiveDiv.textContent = `Hack servers (odd numbers only): ${missionProgress} / ${missionGoal}`;
            const percent = (missionProgress / missionGoal) * 100;
            progressFill.style.width = percent + '%';
            progressText.textContent = `${missionProgress} / ${missionGoal}`;
        } else if (currentMission.type === 'point_threshold') {
            objectiveDiv.textContent = `Steal diamonds from cases 15-20`;
            const percent = (missionProgress / missionGoal) * 100;
            progressFill.style.width = percent + '%';
            progressText.textContent = `$${missionProgress} / $${missionGoal}`;
        } else if (currentMission.type === 'pattern_match') {
            objectiveDiv.textContent = `Win at Lucky Seven (7s and triples): ${missionProgress} / ${missionGoal}`;
            const percent = (missionProgress / missionGoal) * 100;
            progressFill.style.width = percent + '%';
            progressText.textContent = `${missionProgress} / ${missionGoal}`;
        } else if (currentMission.type === 'multi_phase') {
            const phaseNum = currentMission.currentPhase + 1;
            const phase = currentMission.phases[currentMission.currentPhase];

            if (phaseNum === 1) {
                objectiveDiv.textContent = `PHASE 1: Hit sequence ${phase.goal.join(' → ')}`;
                const percent = (phase.progress / phase.goal.length) * 100;
                progressFill.style.width = percent + '%';
                progressText.textContent = `${phase.progress} / ${phase.goal.length}`;
            } else if (phaseNum === 2) {
                objectiveDiv.textContent = `PHASE 2: Hack ${phase.goal} servers (odd numbers)`;
                const percent = (phase.progress / phase.goal) * 100;
                progressFill.style.width = percent + '%';
                progressText.textContent = `${phase.progress} / ${phase.goal}`;
            } else if (phaseNum === 3) {
                objectiveDiv.textContent = `PHASE 3: Steal $${phase.goal} (segments 15-20)`;
                const percent = (phase.progress / phase.goal) * 100;
                progressFill.style.width = percent + '%';
                progressText.textContent = `$${phase.progress} / $${phase.goal}`;
            }
        }
    }

    /**
     * Update crew HUD
     */
    function updateCrewHUD() {
        players.forEach((player, index) => {
            const playerHud = document.getElementById(`player-${index + 1}-hud`);
            const nameSpan = playerHud.querySelector('.player-name-small');
            const scoreSpan = playerHud.querySelector('.player-score-small');

            nameSpan.textContent = player.name;
            scoreSpan.textContent = player.score;

            // Highlight active player
            if (index === activePlayerIndex) {
                playerHud.classList.add('active');
            } else {
                playerHud.classList.remove('active');
            }
        });
    }

    /**
     * Update active player display
     */
    function updateActivePlayer() {
        const player = players[activePlayerIndex];

        document.getElementById('active-player-icon').textContent = player.roleIcon;
        document.getElementById('active-player-name').textContent = player.name;
        document.getElementById('active-player-role').textContent = player.roleName;

        updateCrewHUD();
    }

    /**
     * Show overlay message
     */
    function showOverlayMessage(text, type, duration) {
        const overlay = document.getElementById('overlay-message');
        overlay.textContent = text;
        overlay.className = `overlay-message ${type} show`;

        setTimeout(() => {
            overlay.classList.remove('show');
        }, duration);
    }

    /**
     * Add message to heist feed
     */
    function addToFeed(message, type) {
        const feed = document.getElementById('heist-feed');
        const msg = document.createElement('div');
        msg.className = `feed-message ${type}`;
        msg.textContent = message;

        feed.insertBefore(msg, feed.firstChild);

        // Keep only last 10 messages
        while (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }
    }

    /**
     * End mission
     */
    function endMission(success, reason) {
        console.log('Mission ended:', success, reason);

        gameActive = false;
        if (gameTimer) clearInterval(gameTimer);

        const timeTaken = currentMission.timeLimit - timeRemaining;
        const teamScore = players.reduce((sum, p) => sum + p.score, 0);

        hideAllScreens();

        if (success) {
            // Calculate rewards
            const baseRep = currentMission.difficulty * 100;
            const timeBonus = timeRemaining > 60 ? 100 : 50;
            const alertBonus = alertLevel < 30 ? 100 : alertLevel < 60 ? 50 : 0;
            const totalRep = baseRep + timeBonus + alertBonus;

            crewRep += totalRep;

            // Mark mission as complete
            if (!completedMissions.includes(currentMissionId)) {
                completedMissions.push(currentMissionId);
            }

            // Unlock next mission
            const missionOrder = ['vault', 'databreach', 'diamond', 'casino', 'bigscore'];
            const currentIndex = missionOrder.indexOf(currentMissionId);
            if (currentIndex < missionOrder.length - 1) {
                const nextMission = missionOrder[currentIndex + 1];
                if (!unlockedMissions.includes(nextMission)) {
                    unlockedMissions.push(nextMission);

                    // Show achievement
                    const achievementDiv = document.getElementById('achievement-unlocked');
                    const achievementText = document.getElementById('achievement-text');
                    achievementText.textContent = `MISSION UNLOCKED: ${MISSIONS[nextMission].name}`;
                    achievementDiv.style.display = 'flex';
                }
            }

            // Save progress
            saveProgress();

            // Show success screen
            document.getElementById('mission-complete-screen').style.display = 'block';

            // Populate results
            document.getElementById('result-time').textContent = formatTime(timeTaken);
            document.getElementById('result-alert').textContent = Math.floor(alertLevel) + '%';
            document.getElementById('result-score').textContent = teamScore;
            document.getElementById('rep-earned').textContent = `+${totalRep}`;

            // Populate crew performance
            players.forEach((player, index) => {
                document.getElementById(`perf-player-${index + 1}`).textContent = player.name;
                document.getElementById(`perf-score-${index + 1}`).textContent = player.score;
            });

        } else {
            // Show failure screen
            document.getElementById('mission-failed-screen').style.display = 'block';

            // Populate results
            document.getElementById('failure-reason').textContent = reason;
            document.getElementById('fail-time').textContent = formatTime(timeTaken);
            document.getElementById('fail-alert').textContent = Math.floor(alertLevel) + '%';
            document.getElementById('fail-score').textContent = teamScore;

            // Show tip
            const tips = currentMission.tips || ["Work together as a crew!", "Watch your alert level!", "Use your role abilities!"];
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            document.getElementById('failure-tip').textContent = randomTip;
        }
    }

    /**
     * Replay current mission
     */
    function replayMission() {
        showMissionBriefing(currentMissionId);
    }

    /**
     * Pause game
     */
    function pauseGame() {
        gamePaused = true;
    }

    /**
     * Resume game
     */
    function resumeGame() {
        gamePaused = false;
    }

    /**
     * Hide all screens
     */
    function hideAllScreens() {
        document.getElementById('crew-setup-screen').style.display = 'none';
        document.getElementById('mission-select-screen').style.display = 'none';
        document.getElementById('mission-briefing-screen').style.display = 'none';
        document.getElementById('active-heist-screen').style.display = 'none';
        document.getElementById('mission-complete-screen').style.display = 'none';
        document.getElementById('mission-failed-screen').style.display = 'none';
    }

    /**
     * Format time in MM:SS
     */
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Check if game is active
     */
    function isGameActive() {
        return gameActive;
    }

    // Public API
    return {
        setupCrew: setupCrew,
        showMissionSelect: showMissionSelect,
        showMissionBriefing: showMissionBriefing,
        startMission: startMission,
        handleDartThrow: handleDartThrow,
        replayMission: replayMission,
        pauseGame: pauseGame,
        resumeGame: resumeGame,
        isGameActive: isGameActive
    };
})();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('HEIST CREW: Game module loaded');
});
