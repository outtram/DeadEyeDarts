/**
 * Dad Bod Olympics - The Ultimate Middle-Aged Showdown
 * A 5-player party game celebrating the joys of being 48
 */

const DadBodOlympics = (function() {
    // Game configuration
    const TOTAL_EVENTS = 5;
    const DARTS_PER_PLAYER = 3;
    const MEDAL_POINTS = { gold: 3, silver: 2, bronze: 1 };

    // The 5 hilarious events
    const EVENTS = [
        {
            id: 1,
            name: "THE RECLINER RUSH",
            description: "Race to your favourite chair before someone else takes it! Hit the HIGHEST numbers - the bigger your score, the faster you moved!",
            target: "Aim HIGH! Highest total score wins.",
            icon: "🛋️",
            scoreType: "highest",
            bonusText: "TRIPLE 20 = You knocked the dog off the couch! +50 bonus!",
            bonusCheck: (dart) => dart.segment === 20 && dart.multiplier === 3,
            bonusPoints: 50
        },
        {
            id: 2,
            name: "LAWN MOWER GRAND PRIX",
            description: "Navigate your mower in perfect lines! Hit EVEN numbers only - odd numbers mean you've gone crooked!",
            target: "Only EVEN numbers count! Odd numbers = 0 points!",
            icon: "🚜",
            scoreType: "even_only",
            bonusText: "BULLSEYE = Perfect stripes! The neighbours are jealous! +100 bonus!",
            bonusCheck: (dart) => dart.segment === 25 || dart.segment === 0,
            bonusPoints: 100
        },
        {
            id: 3,
            name: "BBQ MASTER CHEF",
            description: "Cook the perfect snag! Hit numbers 10-20 for that perfect medium-rare. Under 10 is raw, over is burnt!",
            target: "10-20 = Full points | Under 10 = Half points | Bullseye = BURNT!",
            icon: "🔥",
            scoreType: "bbq_zone",
            bonusText: "TRIPLE 15 = Perfectly cooked! Wife approves! +75 bonus!",
            bonusCheck: (dart) => dart.segment === 15 && dart.multiplier === 3,
            bonusPoints: 75
        },
        {
            id: 4,
            name: "THE DAD JOKE DELIVERY",
            description: "Timing is everything! Hit numbers that add up to exactly 50 across your 3 darts. Over or under and nobody laughs!",
            target: "Get as CLOSE to 50 total as possible! Exact 50 = PERFECT PUNCHLINE!",
            icon: "😂",
            scoreType: "target_50",
            bonusText: "Exactly 50 = Everyone groaned! That's the goal! +150 bonus!",
            bonusCheck: null, // Checked at round end
            bonusPoints: 150
        },
        {
            id: 5,
            name: "REMOTE CONTROL RAGE",
            description: "Find the remote in the couch cushions! Hit DOUBLES and TRIPLES - single numbers mean you found old chips instead!",
            target: "DOUBLES = 2x points | TRIPLES = 3x points | Singles = 0!",
            icon: "📺",
            scoreType: "multiples_only",
            bonusText: "DOUBLE BULL = Found the remote AND a $20 note! +200 bonus!",
            bonusCheck: (dart) => dart.segment === 25 && dart.multiplier === 2,
            bonusPoints: 200
        }
    ];

    // Funny commentary for different situations
    const COMMENTARY = {
        great: [
            "Still got it!",
            "The old fella's not dead yet!",
            "That's what 48 years of practice looks like!",
            "Your wife would be impressed... if she was watching!",
            "The knees might hurt but the arm's still golden!"
        ],
        good: [
            "Not bad for an old bloke!",
            "Respectable! Very respectable!",
            "That'll do, mate!",
            "The dad reflexes kicked in!",
            "Solid as a station wagon!"
        ],
        bad: [
            "Did you forget your glasses?",
            "That throw had 'I need a nap' energy!",
            "Your back's probably still hurting from that one!",
            "Mate, was that arm asleep?",
            "Time for another beer and try again!"
        ],
        miss: [
            "Your kids throw better than that!",
            "That's embarrassing at any age!",
            "Did you close your eyes?",
            "Maybe stick to lawn bowls?",
            "Even your dad jokes land better than that!"
        ]
    };

    // Game state
    let gameActive = false;
    let players = [];
    let currentRound = 0;
    let currentPlayerIndex = 0;
    let currentDartCount = 0;
    let roundScores = {};
    let totalMedalPoints = {};
    let eventBonuses = {};
    let allTimeStats = {};

    // DOM elements
    let elements = {};

    function initElements() {
        elements = {
            setupScreen: document.getElementById('setup-screen'),
            gameScreen: document.getElementById('game-screen'),
            finalScreen: document.getElementById('final-screen'),
            roundNumber: document.getElementById('round-number'),
            eventName: document.getElementById('event-name'),
            eventText: document.getElementById('event-text'),
            eventTarget: document.getElementById('event-target'),
            throwerName: document.getElementById('thrower-name'),
            throwCount: document.getElementById('throw-count'),
            scoreboard: document.getElementById('scoreboard'),
            gameMessage: document.getElementById('game-message'),
            roundResults: document.getElementById('round-results'),
            resultsList: document.getElementById('results-list'),
            winnerPodium: document.getElementById('winner-podium'),
            finalStandings: document.getElementById('final-standings'),
            specialAwards: document.getElementById('special-awards'),
            instructions: document.getElementById('instructions')
        };
    }

    function startGame() {
        if (!elements.setupScreen) initElements();

        // Collect player names
        players = [];
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`player${i}`);
            const name = input.value.trim() || `Dad ${i}`;
            players.push(name);
        }

        // Initialize scores
        players.forEach(player => {
            totalMedalPoints[player] = 0;
            allTimeStats[player] = {
                totalScore: 0,
                bullseyes: 0,
                triples: 0,
                doubles: 0,
                misses: 0,
                bonuses: 0
            };
        });

        // Start the game
        gameActive = true;
        currentRound = 0;

        // Switch screens
        elements.setupScreen.classList.remove('active');
        elements.gameScreen.classList.add('active');
        elements.instructions.style.display = 'none';

        // Start first round
        startRound();

        console.log('DadBodOlympics: Game started with players:', players);
    }

    function startRound() {
        currentRound++;
        currentPlayerIndex = 0;
        currentDartCount = 0;

        // Reset round scores
        roundScores = {};
        eventBonuses = {};
        players.forEach(player => {
            roundScores[player] = { darts: [], total: 0 };
            eventBonuses[player] = 0;
        });

        const event = EVENTS[currentRound - 1];

        // Update UI
        elements.roundNumber.textContent = currentRound;
        elements.eventName.textContent = event.name;
        elements.eventName.innerHTML = `${event.icon} ${event.name} ${event.icon}`;
        elements.eventText.textContent = event.description;
        elements.eventTarget.innerHTML = `<strong>TARGET:</strong> ${event.target}<br><em>${event.bonusText}</em>`;

        // Hide results, show game
        elements.roundResults.classList.remove('show');

        // Update current thrower
        updateCurrentThrower();

        // Build scoreboard
        buildScoreboard();

        showMessage(`EVENT ${currentRound}: ${event.name}`, 'event');

        console.log(`DadBodOlympics: Starting round ${currentRound} - ${event.name}`);
    }

    function updateCurrentThrower() {
        const player = players[currentPlayerIndex];
        elements.throwerName.textContent = player;
        elements.throwCount.textContent = `(Dart ${currentDartCount + 1} of ${DARTS_PER_PLAYER})`;

        // Highlight current player in scoreboard
        document.querySelectorAll('.player-row').forEach((row, index) => {
            row.classList.toggle('current', index === currentPlayerIndex);
        });
    }

    function buildScoreboard() {
        let html = '';
        players.forEach((player, index) => {
            const medalPoints = totalMedalPoints[player];
            const roundTotal = roundScores[player]?.total || 0;
            html += `
                <div class="player-row ${index === currentPlayerIndex ? 'current' : ''}">
                    <span class="player-name">${player}</span>
                    <span class="player-round-score">${roundTotal}</span>
                    <span class="player-medals">${getMedalDisplay(medalPoints)}</span>
                </div>
            `;
        });
        elements.scoreboard.innerHTML = html;
    }

    function getMedalDisplay(points) {
        if (points === 0) return '-';
        return `${points} pts`;
    }

    function handleDartThrow(dart) {
        if (!gameActive) return;

        const player = players[currentPlayerIndex];
        const event = EVENTS[currentRound - 1];

        console.log(`DadBodOlympics: ${player} threw - segment: ${dart.segment}, multiplier: ${dart.multiplier}, value: ${dart.value}`);

        // Calculate score based on event type
        const scoreResult = calculateEventScore(dart, event);
        roundScores[player].darts.push(scoreResult);
        roundScores[player].total += scoreResult.points;

        // Check for bonus
        if (event.bonusCheck && event.bonusCheck(dart)) {
            eventBonuses[player] += event.bonusPoints;
            showMessage(`${event.bonusText}`, 'bonus');
        }

        // Track stats
        updateStats(player, dart, scoreResult);

        // Show commentary
        showDartCommentary(player, scoreResult);

        // Update scoreboard
        buildScoreboard();

        currentDartCount++;

        // Check if player finished their darts
        if (currentDartCount >= DARTS_PER_PLAYER) {
            // Check for target_50 bonus (Dad Joke event)
            if (event.scoreType === 'target_50' && roundScores[player].total === 50) {
                eventBonuses[player] += event.bonusPoints;
                showMessage("EXACTLY 50! PERFECT DAD JOKE TIMING! +150!", 'bonus');
            }

            currentDartCount = 0;
            currentPlayerIndex++;

            if (currentPlayerIndex >= players.length) {
                // Round complete
                setTimeout(() => endRound(), 1500);
            } else {
                updateCurrentThrower();
                showMessage(`${players[currentPlayerIndex]}'s turn!`, 'info');
            }
        } else {
            updateCurrentThrower();
        }
    }

    function calculateEventScore(dart, event) {
        const { segment, multiplier, value } = dart;
        let points = 0;
        let description = '';

        switch (event.scoreType) {
            case 'highest':
                // Simple - highest score wins
                points = value;
                description = `${value} points`;
                break;

            case 'even_only':
                // Only even segments count
                if (segment % 2 === 0 || segment === 0) {
                    points = value;
                    description = `${value} - Nice straight line!`;
                } else {
                    points = 0;
                    description = `ODD NUMBER - You went crooked!`;
                }
                break;

            case 'bbq_zone':
                // 10-20 = full, under 10 = half, bullseye = 0
                if (segment === 25 || segment === 0) {
                    points = 0;
                    description = 'BURNT IT! No points!';
                } else if (segment >= 10 && segment <= 20) {
                    points = value;
                    description = `${value} - Perfectly cooked!`;
                } else {
                    points = Math.floor(value / 2);
                    description = `${points} - Bit undercooked!`;
                }
                break;

            case 'target_50':
                // All points count, closest to 50 total wins
                points = value;
                description = `${value} points`;
                break;

            case 'multiples_only':
                // Only doubles and triples count
                if (multiplier >= 2) {
                    points = value;
                    description = `${multiplier === 3 ? 'TRIPLE' : 'DOUBLE'}! ${value} points!`;
                } else {
                    points = 0;
                    description = 'SINGLE - Found old chips instead!';
                }
                break;

            default:
                points = value;
                description = `${value} points`;
        }

        return { points, description, dart };
    }

    function updateStats(player, dart, scoreResult) {
        const stats = allTimeStats[player];
        stats.totalScore += scoreResult.points;

        if (dart.segment === 25 || dart.segment === 0) {
            stats.bullseyes++;
        }
        if (dart.multiplier === 3) {
            stats.triples++;
        }
        if (dart.multiplier === 2) {
            stats.doubles++;
        }
        if (scoreResult.points === 0) {
            stats.misses++;
        }
    }

    function showDartCommentary(player, scoreResult) {
        let commentaryType;
        if (scoreResult.points >= 40) {
            commentaryType = 'great';
        } else if (scoreResult.points >= 20) {
            commentaryType = 'good';
        } else if (scoreResult.points > 0) {
            commentaryType = 'bad';
        } else {
            commentaryType = 'miss';
        }

        const comments = COMMENTARY[commentaryType];
        const comment = comments[Math.floor(Math.random() * comments.length)];

        showMessage(`${scoreResult.description} - ${comment}`, commentaryType === 'miss' ? 'miss' : 'throw');
    }

    function endRound() {
        const event = EVENTS[currentRound - 1];

        // Calculate final scores including bonuses
        let finalScores = [];
        players.forEach(player => {
            let finalScore = roundScores[player].total + eventBonuses[player];

            // For target_50 event, score is how close to 50
            if (event.scoreType === 'target_50') {
                finalScore = 1000 - Math.abs(50 - roundScores[player].total);
                if (roundScores[player].total === 50) {
                    finalScore += event.bonusPoints;
                }
            }

            finalScores.push({
                player,
                roundScore: roundScores[player].total,
                bonus: eventBonuses[player],
                finalScore,
                darts: roundScores[player].darts
            });
        });

        // Sort by final score
        finalScores.sort((a, b) => b.finalScore - a.finalScore);

        // Award medals
        if (finalScores[0]) {
            totalMedalPoints[finalScores[0].player] += MEDAL_POINTS.gold;
            allTimeStats[finalScores[0].player].bonuses++;
        }
        if (finalScores[1]) {
            totalMedalPoints[finalScores[1].player] += MEDAL_POINTS.silver;
        }
        if (finalScores[2]) {
            totalMedalPoints[finalScores[2].player] += MEDAL_POINTS.bronze;
        }

        // Show results
        showRoundResults(finalScores, event);
    }

    function showRoundResults(finalScores, event) {
        let html = '';
        const medals = ['🥇', '🥈', '🥉', '4th', '5th'];

        finalScores.forEach((score, index) => {
            const medal = medals[index];
            let displayScore = score.roundScore;
            if (event.scoreType === 'target_50') {
                const diff = Math.abs(50 - score.roundScore);
                displayScore = `${score.roundScore} (${diff === 0 ? 'PERFECT!' : diff + ' off'})`;
            }

            html += `
                <div class="result-row ${index < 3 ? 'medal-' + (index + 1) : ''}">
                    <span class="result-medal">${medal}</span>
                    <span class="result-name">${score.player}</span>
                    <span class="result-score">${displayScore}${score.bonus > 0 ? ` +${score.bonus}` : ''}</span>
                </div>
            `;
        });

        elements.resultsList.innerHTML = html;
        elements.roundResults.classList.add('show');

        // Update button text
        const nextBtn = document.getElementById('next-round-btn');
        if (currentRound >= TOTAL_EVENTS) {
            nextBtn.textContent = 'SEE FINAL RESULTS!';
        } else {
            nextBtn.textContent = 'NEXT EVENT';
        }
    }

    function nextRound() {
        elements.roundResults.classList.remove('show');

        if (currentRound >= TOTAL_EVENTS) {
            endGame();
        } else {
            startRound();
        }
    }

    function endGame() {
        gameActive = false;

        // Calculate final standings
        let standings = players.map(player => ({
            player,
            medalPoints: totalMedalPoints[player],
            stats: allTimeStats[player]
        }));

        standings.sort((a, b) => b.medalPoints - a.medalPoints);

        // Build podium
        buildPodium(standings);

        // Build full standings
        buildStandings(standings);

        // Award special awards
        buildAwards(standings);

        // Switch screens
        elements.gameScreen.classList.remove('active');
        elements.finalScreen.classList.add('active');
    }

    function buildPodium(standings) {
        const top3 = standings.slice(0, 3);
        let html = '<div class="podium-container">';

        // Second place (left)
        if (top3[1]) {
            html += `
                <div class="podium-position second">
                    <div class="podium-player">${top3[1].player}</div>
                    <div class="podium-medal">🥈</div>
                    <div class="podium-block">2nd</div>
                    <div class="podium-points">${top3[1].medalPoints} pts</div>
                </div>
            `;
        }

        // First place (center)
        if (top3[0]) {
            html += `
                <div class="podium-position first">
                    <div class="podium-crown">👑</div>
                    <div class="podium-player">${top3[0].player}</div>
                    <div class="podium-medal">🥇</div>
                    <div class="podium-block">1st</div>
                    <div class="podium-points">${top3[0].medalPoints} pts</div>
                    <div class="podium-title">DAD BOD CHAMPION!</div>
                </div>
            `;
        }

        // Third place (right)
        if (top3[2]) {
            html += `
                <div class="podium-position third">
                    <div class="podium-player">${top3[2].player}</div>
                    <div class="podium-medal">🥉</div>
                    <div class="podium-block">3rd</div>
                    <div class="podium-points">${top3[2].medalPoints} pts</div>
                </div>
            `;
        }

        html += '</div>';
        elements.winnerPodium.innerHTML = html;
    }

    function buildStandings(standings) {
        let html = '<h3>FINAL STANDINGS</h3>';
        standings.forEach((s, index) => {
            html += `
                <div class="standing-row">
                    <span class="standing-position">${index + 1}</span>
                    <span class="standing-name">${s.player}</span>
                    <span class="standing-points">${s.medalPoints} medal pts</span>
                    <span class="standing-total">(${s.stats.totalScore} total score)</span>
                </div>
            `;
        });
        elements.finalStandings.innerHTML = html;
    }

    function buildAwards(standings) {
        const awards = [];

        // Most bullseyes
        const bullseyeKing = [...standings].sort((a, b) => b.stats.bullseyes - a.stats.bullseyes)[0];
        if (bullseyeKing.stats.bullseyes > 0) {
            awards.push({
                title: "EAGLE EYE AWARD",
                player: bullseyeKing.player,
                reason: `${bullseyeKing.stats.bullseyes} bullseye${bullseyeKing.stats.bullseyes > 1 ? 's' : ''}!`,
                emoji: "🎯"
            });
        }

        // Most triples
        const tripleKing = [...standings].sort((a, b) => b.stats.triples - a.stats.triples)[0];
        if (tripleKing.stats.triples > 0) {
            awards.push({
                title: "TRIPLE THREAT",
                player: tripleKing.player,
                reason: `${tripleKing.stats.triples} triple${tripleKing.stats.triples > 1 ? 's' : ''} hit!`,
                emoji: "🔥"
            });
        }

        // Most misses (good-natured ribbing)
        const missKing = [...standings].sort((a, b) => b.stats.misses - a.stats.misses)[0];
        if (missKing.stats.misses > 0) {
            awards.push({
                title: "NEEDS NEW GLASSES",
                player: missKing.player,
                reason: `${missKing.stats.misses} zero-pointers!`,
                emoji: "👓"
            });
        }

        // Last place award
        const lastPlace = standings[standings.length - 1];
        awards.push({
            title: "PARTICIPATION TROPHY",
            player: lastPlace.player,
            reason: "You showed up! That's something!",
            emoji: "🏆"
        });

        let html = '';
        awards.forEach(award => {
            html += `
                <div class="award-card">
                    <span class="award-emoji">${award.emoji}</span>
                    <span class="award-title">${award.title}</span>
                    <span class="award-winner">${award.player}</span>
                    <span class="award-reason">${award.reason}</span>
                </div>
            `;
        });
        elements.specialAwards.innerHTML = html;
    }

    function showMessage(text, type = 'info') {
        elements.gameMessage.textContent = text;
        elements.gameMessage.className = `game-message ${type} show`;
        setTimeout(() => {
            elements.gameMessage.classList.remove('show');
        }, 2000);
    }

    function resetGame() {
        // Reset all state
        gameActive = false;
        players = [];
        currentRound = 0;
        currentPlayerIndex = 0;
        currentDartCount = 0;
        roundScores = {};
        totalMedalPoints = {};
        eventBonuses = {};
        allTimeStats = {};

        // Clear inputs
        for (let i = 1; i <= 5; i++) {
            document.getElementById(`player${i}`).value = '';
        }

        // Switch screens
        elements.finalScreen.classList.remove('active');
        elements.gameScreen.classList.remove('active');
        elements.setupScreen.classList.add('active');
        elements.instructions.style.display = 'block';
    }

    function isGameActive() {
        return gameActive;
    }

    // Public API
    return {
        startGame,
        handleDartThrow,
        nextRound,
        resetGame,
        isGameActive
    };
})();
