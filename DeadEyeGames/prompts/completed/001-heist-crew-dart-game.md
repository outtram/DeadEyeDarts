<objective>
Design and implement an innovative, story-driven multiplayer dart game called "HEIST CREW" for 3 players using the autodarts.io framework. This game should be fun, exciting, visually appealing, and perfect for casual social play with friends.

The game combines cooperative heist missions with time-based challenges, character roles, and progressive difficulty - creating an engaging narrative experience where every dart throw matters to the crew's success.
</objective>

<context>
This is for the DeadEyeGames platform, which already has:
- Flask server with Socket.IO integration to autodarts.io via darts-caller
- Cyberpunk retro aesthetic with neon colors
- Access to real-time dart throw data: segment (1-20), multiplier (1=single, 2=double, 3=triple), value
- Existing zombie-slayer game as a reference: @/Users/troyouttram/CODE/DeadEyeGames/games/zombie-slayer/

Target audience: 3 casual friends playing together socially (not professional dart players)

Why this matters: The game should create memorable social experiences with story progression, teamwork mechanics, and exciting time pressure that keeps all 3 players engaged and invested in the outcome.
</context>

<game_concept>
**HEIST CREW** - A cooperative 3-player cyberpunk heist game where players take on specialized roles (Hacker, Infiltrator, Demolitions Expert) to complete timed heist missions by hitting specific dart targets.

**Core Innovation - What Makes It Unique:**

1. **Character Role System**: Each player chooses a role with unique abilities
   - **Hacker**: Doubles give 2x time bonus, can "bypass" one security system per mission
   - **Infiltrator**: Triples count as instant success, earns stealth bonuses
   - **Demolitions Expert**: Bulls-eye triggers explosive bonus (clears multiple targets), high risk/reward

2. **Story-Driven Progression**: 5 escalating heist missions with narrative
   - Mission 1: "The Vault Job" - Crack the safe (hit sequence of numbers)
   - Mission 2: "Data Breach" - Hack servers (hit odd numbers only)
   - Mission 3: "Diamond District" - Steal jewels (hit high-value segments 15-20)
   - Mission 4: "Casino Royale" - Beat the house (hit specific patterns)
   - Mission 5: "The Big Score" - Final heist (combination of all mechanics)

3. **Time Pressure Mechanics**:
   - Each mission has a countdown timer (2-5 minutes depending on mission)
   - "Alert Level" system: misses increase alert, raising difficulty
   - "Escape Timer": Final 30 seconds triggers intense escape sequence
   - Time bonuses for quick completions and combos

4. **Cooperative Multiplayer**:
   - Shared mission objectives (all 3 players work toward same goal)
   - Player rotation system (players take turns throwing)
   - Combo system: consecutive hits by different players multiply score
   - Emergency callouts: players can "tag in" to help struggling teammates

5. **Visual Appeal**:
   - Animated heist scenes that respond to dart throws
   - Progress bars for objectives (safe cracking, server hacking, etc.)
   - Alert level indicators with pulsing red warnings
   - Character portraits with role-specific animations
   - Mission briefing screens with story text
   - Escape van animation when mission succeeds

6. **Progression & Rewards**:
   - Unlock new missions by completing previous ones
   - Earn "Crew Rep" points for high scores
   - Unlock "Special Gear" (modifiers for replay value)
   - Mission leaderboard with time records
   - Achievement badges ("Perfect Heist", "Speed Run", "No Alerts", etc.)
</game_concept>

<requirements>

**Essential Features:**

1. **Player Setup Screen**:
   - Input 3 player names
   - Each player selects their role (Hacker/Infiltrator/Demolitions)
   - Mission selection (unlocked based on progress)
   - Display crew roster with role icons

2. **Mission Briefing**:
   - Story text for the mission
   - Objectives clearly listed
   - Time limit displayed
   - "Start Heist" button

3. **Active Gameplay HUD**:
   - Timer (large, prominent, color-coded: green→yellow→red)
   - Alert Level meter (0-100%, visual warning at 70%+)
   - Current objective display (e.g., "CRACK THE SAFE: Hit 7, 14, 20")
   - Active player indicator (whose turn it is)
   - Team score/progress
   - Mission progress bar
   - Role ability status (available/cooldown)

4. **Dart Throw Processing**:
   - Integrate with existing DartsClient.init() pattern
   - Parse dart data: segment, multiplier, value
   - Apply role-specific bonuses
   - Check against current mission objectives
   - Update alert level on misses
   - Trigger visual/audio feedback
   - Rotate to next player

5. **Mission Objectives** (implement at least 3 varied types):
   - **Sequence Hit**: Hit specific numbers in order (safe cracking)
   - **Target Count**: Hit X darts in specific zone (15-20, odds, evens)
   - **Point Threshold**: Accumulate X points before timer expires
   - **Pattern Match**: Hit specific pattern (outer ring, triples only, etc.)
   - **Speed Challenge**: Complete objective in under 60 seconds

6. **Mission Success/Failure**:
   - Success: Escape animation, mission complete screen, rewards
   - Failure: Alert at 100% or timer expires, crew captured screen
   - Summary stats: time taken, darts thrown, alert level, role MVPs
   - Unlock next mission (if applicable)
   - Return to mission select

7. **Progression System**:
   - Save completed missions to localStorage
   - Track best times and scores per mission
   - Unlock achievements
   - Persistent crew stats

**Technical Requirements:**

- Follow existing DeadEyeGames architecture pattern from zombie-slayer
- Create `/games/heist-crew/` directory with heist.html, heist.js, heist.css
- Use Socket.IO integration via DartsClient
- Responsive to dart_thrown events with proper data handling
- Support game state persistence (localStorage)
- Clean, modular JavaScript (similar to ZombieGame pattern)
- Mobile-friendly responsive design

**Visual Requirements:**

- Match cyberpunk aesthetic (use existing CSS variables from /static/css/cyberpunk.css)
- Animated elements: timers, progress bars, alert indicators
- Character role icons/badges
- Mission-specific background imagery or color themes
- Smooth transitions between game states
- Celebratory animations for successes
- Warning effects for high alert/low time
</requirements>

<implementation>

**File Structure:**
```
/games/heist-crew/
  heist.html  - Main game page
  heist.js    - Game logic and state management
  heist.css   - Game-specific styles
```

**Development Approach:**

1. **Start Simple, Build Up**: Begin with core Mission 1 mechanics, then expand
2. **Modular Design**: Separate concerns (mission logic, UI updates, dart handling, progression)
3. **Test-Driven**: Build one mission type fully before adding complexity
4. **Reuse Patterns**: Follow ZombieGame.js structure (module pattern, clear public API)

**Key JavaScript Architecture:**

```javascript
const HeistGame = (function() {
    // Game state
    let gameActive = false;
    let currentMission = null;
    let players = [];  // {name, role, score}
    let activePlayerIndex = 0;
    let timer = 0;
    let alertLevel = 0;
    let missionProgress = {};

    // Mission definitions
    const MISSIONS = {
        vault: { name: "The Vault Job", timeLimit: 180, objectives: [...] },
        // ... more missions
    };

    // Public API
    return {
        setupCrew: function(playerNames, playerRoles) { },
        startMission: function(missionId) { },
        handleDartThrow: function(dart) { },
        endMission: function(success) { },
        // ... more methods
    };
})();
```

**What to Avoid (and WHY):**

- ❌ Don't overcomplicate Mission 1 - keep first mission simple so players understand mechanics before complexity increases
- ❌ Don't use hard-coded player names - always allow custom names for social play
- ❌ Don't make missions too difficult - target casual players, not professionals
- ❌ Don't ignore visual feedback - every dart throw should have clear visual/textual response so players know if they succeeded
- ❌ Don't skip the story - narrative context makes the game memorable and engaging
- ❌ Don't make alert level punishing - it should add tension, not frustration
- ❌ Don't forget mobile users - buttons and text should be readable on phone screens

**Go Beyond The Basics:**

This is your chance to create something truly innovative and memorable! Include:
- Dramatic sound effect triggers (even if just text descriptions like "🔊 ALARM!")
- Animated ASCII art or emoji sequences for big moments
- Easter eggs in the story text
- Clever role-based dialogue/flavor text
- Multiple paths to success (don't force one strategy)
- Replayability through varied objectives and roles
- Surprise moments (unexpected bonuses, plot twists in later missions)
</implementation>

<output>
Create the following files in the DeadEyeGames project:

**Primary Files:**
- `./games/heist-crew/heist.html` - Complete game page with all UI elements
- `./games/heist-crew/heist.js` - Full game logic with mission system
- `./games/heist-crew/heist.css` - Styling matching cyberpunk theme

**Integration:**
- Update `./templates/homepage.html` to add "HEIST CREW" game card in the games section (follow pattern of existing zombie-slayer card)

**Documentation:**
- `./games/heist-crew/README.md` - Game rules, role descriptions, mission guide
</output>

<mission_examples>
To inspire your implementation, here are detailed examples of mission mechanics:

**Mission 1: "The Vault Job"**
- Objective: Crack the vault by hitting the combination (3 specific numbers in sequence)
- Time: 3 minutes
- Mechanics:
  - Display "COMBINATION: ? ? ?" - reveals one number at a time
  - Hit correct number → next number reveals
  - Wrong number → alert +10%, shake effect
  - Complete all 3 → success
- Story: "The crew needs to crack the vault at the Central City Bank. The Hacker has narrowed down the combination to three numbers. Hit them in sequence before security arrives!"

**Mission 2: "Data Breach"**
- Objective: Hack 10 servers by hitting odd numbers only
- Time: 4 minutes
- Mechanics:
  - Counter: "SERVERS HACKED: 0/10"
  - Any odd number (1,3,5,7,9,11,13,15,17,19) → +1 server
  - Even number → alert +15%, "FIREWALL DETECTED!"
  - Hacker role bonus: doubles on odd numbers count as 2 servers
- Story: "Infiltrate the corporate mainframe by targeting their server clusters. Only odd-numbered servers are vulnerable to your exploit!"

**Mission 3: "Diamond District"**
- Objective: Steal $50,000 worth of diamonds (hit segments 15-20)
- Time: 5 minutes
- Mechanics:
  - Display running total: "$X,XXX / $50,000"
  - Segments 15-20: value × multiplier × $100
  - Segment below 15 → alert +5%, "WRONG DISPLAY CASE!"
  - Triples in 15-20 zone → bonus sparkle effect, extra $500
- Story: "The rarest diamonds are in the high-security cases marked 15-20. Grab enough loot before the guards complete their patrol!"
</mission_examples>

<verification>
Before declaring the implementation complete, verify:

1. **Core Loop Works**:
   - Can setup 3 players with roles
   - Can start Mission 1
   - Dart throws are detected and processed
   - Mission success/failure triggers properly
   - Can return to mission select

2. **Role System Functions**:
   - Each role has distinct visual indicator
   - Role abilities actually work (test Hacker double bonus, etc.)
   - Role is clearly displayed during active turn

3. **Timer & Alert System**:
   - Timer counts down visually
   - Timer expiration triggers mission failure
   - Alert level increases on misses
   - Alert at 100% triggers failure
   - Visual warnings at high alert

4. **Mission Variety**:
   - At least 2-3 different mission types implemented
   - Each mission has unique objectives
   - Progressive difficulty is noticeable

5. **Visual Polish**:
   - Matches cyberpunk aesthetic
   - Smooth animations/transitions
   - Clear feedback on every dart throw
   - Responsive on different screen sizes

6. **Progression Works**:
   - Completing Mission 1 unlocks Mission 2
   - Progress persists across page reloads
   - Can replay completed missions

7. **Integration**:
   - Game appears on homepage
   - Socket.IO connection works
   - Follows existing code patterns

**Test with real dart throws or simulated data to ensure the game is fun and the pacing feels right!**
</verification>

<success_criteria>
A successful implementation will:

✓ Provide an engaging 3-player cooperative experience
✓ Have clear story progression across multiple missions
✓ Create exciting time-pressure moments
✓ Make each player role feel unique and valuable
✓ Be visually appealing with cyberpunk aesthetic
✓ Work seamlessly with autodarts.io dart detection
✓ Be easy to learn but offer depth through roles and missions
✓ Create memorable moments worth talking about after playing
✓ Make players want to replay missions to beat their times
✓ Feel polished and complete, not like a tech demo

The game should make 3 friends say "one more heist!" at the end of their session.
</success_criteria>