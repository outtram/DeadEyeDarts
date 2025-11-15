# Meta-Prompting Guide for DeadEyeDarts Development

## ✅ Installation Complete!

The meta-prompting system is now installed and ready to use!

**Installed commands:**
- `/create-prompt` - Creates optimized, structured prompts
- `/run-prompt` - Executes prompts in fresh context

---

## What is Meta-Prompting?

Instead of telling Claude what to do, you tell Claude **what you want**, and it figures out **how to ask itself** to do it.

### The Magic:
1. **You:** "I want zombies to have health bars and take damage"
2. **Claude (create-prompt):** Asks clarifying questions, analyzes your code, creates a detailed spec
3. **Claude (run-prompt):** Fresh sub-agent executes the perfect prompt on first try

---

## Quick Start

### Basic Workflow

```bash
# Step 1: Describe what you want
/create-prompt Add health bars to zombies that show damage when hit

# Step 2: Answer any clarifying questions
# Claude might ask: "Where should health bars display? How much health per zombie?"

# Step 3: Review and confirm
# Claude shows what it understood

# Step 4: Execute
# Choose option 1 to run immediately
```

That's it! The prompt runs in a fresh context and implements your feature.

---

## Real Examples for Your Zombie Game

### Example 1: Add New Game Feature

```
/create-prompt I want to add multiple zombie types - fast zombies, tank zombies, and boss zombies with different health and point values
```

**What happens:**
- Claude asks: "How much health for each type? Different point values? Visual indicators?"
- You answer
- Claude creates a structured prompt with success criteria
- Runs in fresh context, implements everything

---

### Example 2: Refactor Existing Code

```
/create-prompt Refactor the dart tracking logic to support multiple game modes - survival mode, timed mode, and endless mode
```

**What happens:**
- Claude analyzes your existing code structure
- Asks about mode differences and transitions
- Creates prompts for each mode
- You choose to run them in parallel or sequential

---

### Example 3: Add Scoring System

```
/create-prompt Create a comprehensive scoring system with combo multipliers, accuracy bonuses, and a leaderboard
```

**What happens:**
- Claude breaks this into multiple prompts:
  1. Scoring calculation engine
  2. Combo system
  3. Leaderboard database and UI
- Offers to run in parallel (since independent)
- All three execute simultaneously!

---

## When to Use Meta-Prompting

### ✅ USE for:

**Complex Features:**
- Adding new game modes
- Implementing zombie AI
- Creating multiplayer functionality
- Building a complete UI system
- Adding sound effects and animations

**Refactoring:**
- Restructuring game loop
- Separating concerns (game logic vs display)
- Adding TypeScript types
- Database schema changes

**Multi-Step Tasks:**
- Setting up real-time multiplayer
- Implementing save/load system
- Adding user accounts and profiles
- Performance optimization

---

### ❌ SKIP for:

**Simple Changes:**
- "Change zombie color to red"
- "Fix typo in message"
- "Add one more zombie number"

**Quick Experiments:**
- "Try a different font"
- "Test what happens if..."

Just ask me directly for simple stuff!

---

## Advanced Usage

### Multiple Zombies Types with Parallel Execution

```
/create-prompt I want to implement 5 different zombie types: Runner, Tank, Exploder, Healer, and Boss. Each needs unique behavior, health, speed, and special abilities.
```

Claude will likely create 5 prompts and offer:
```
1. Run all 5 prompts in parallel (recommended - they're independent)
2. Run sequentially
3. Review first
```

Choose 1 → All 5 zombie types get implemented simultaneously!

---

### Sequential Game Flow Implementation

```
/create-prompt Build a complete game flow: main menu → difficulty selection → game play → game over → leaderboard
```

Claude creates sequential prompts because each depends on the previous:
```
1. Main menu UI
2. Difficulty selection (needs menu)
3. Game play integration (needs difficulty)
4. Game over screen (needs game state)
5. Leaderboard (needs scores)
```

Chooses sequential execution automatically.

---

## Understanding the Prompts

All prompts are saved to `./prompts/`:

```
DeadEyeDarts/
├── prompts/
│   ├── 001-add-zombie-health-system.md
│   ├── 002-implement-combo-multiplier.md
│   ├── 003-create-leaderboard-ui.md
│   └── completed/
│       └── 001-add-zombie-health-system.md  # After execution
```

### You Can:
- Review prompts before running
- Edit prompts if needed
- Save for later
- Run anytime with `/run-prompt 001`

---

## Tips for Best Results

### 1. Be Conversational

**Good:**
```
/create-prompt I want players to fight zombies together online. They should see each other's dart throws in real-time and combine damage.
```

**Not needed:**
```
/create-prompt Implement a WebSocket-based multiplayer system using Socket.IO with real-time state synchronization, conflict resolution, and...
```

Let Claude figure out the details!

---

### 2. Answer Clarifying Questions Thoroughly

When Claude asks:
```
"Should multiplayer be limited to 2 players or support more?
Should zombies scale health with player count?"
```

Give thoughtful answers! Your responses directly impact prompt quality.

---

### 3. Review Generated Prompts

Before executing, look at the saved `.md` file:
- Does it understand your goal?
- Are success criteria clear?
- Any missing details?

You can edit the file before running!

---

### 4. Trust the System

Claude adds things you might forget:
- ✅ Success criteria ("Zombies should lose health when hit")
- ✅ Verification steps ("Test with 3 dart throws")
- ✅ What to avoid ("Don't use global variables because...")
- ✅ Edge cases ("What if zombie health goes negative?")

---

### 5. Use Parallel Execution

If Claude detects independent features:
```
✓ Saved prompts:
  - 001-add-sound-effects.md
  - 002-add-particle-effects.md
  - 003-add-zombie-animations.md

These can run in PARALLEL!
```

Say YES! All three implement simultaneously, no waiting.

---

## Common Scenarios

### Scenario 1: "I have an idea but not sure how"

```
/create-prompt I want some kind of power-up system where hitting certain numbers gives you special abilities
```

Claude will ask:
- What numbers trigger power-ups?
- What abilities (slow time, double damage, etc)?
- How long do they last?
- Visual indicators?

Then creates a complete spec!

---

### Scenario 2: "This code is messy"

```
/create-prompt The deadeyedarts_client.py file is getting too big. Refactor it into separate modules for game logic, display, and networking.
```

Claude analyzes your file structure and creates prompts for clean separation.

---

### Scenario 3: "Add feature like game X"

```
/create-prompt Add a wave system like in Call of Duty Zombies - waves of increasing difficulty with breaks between
```

Claude knows the pattern and asks:
- How many zombies per wave?
- How should difficulty scale?
- Break duration?
- Round display?

Creates complete wave system!

---

## Debugging with Meta-Prompting

```
/create-prompt The zombie hit detection isn't working properly. Debug and fix the issue, making sure hits register accurately for all multipliers.
```

Claude will:
1. Analyze your dart tracking code
2. Identify the bug
3. Create fix with tests
4. Verify it works

---

## Building Your Full Game

Here's how you might build out DeadEyeDarts using meta-prompting:

### Phase 1: Core Game Loop
```
/create-prompt Implement a complete game loop with rounds, waves of zombies, and win/lose conditions
```

### Phase 2: Zombie Variety
```
/create-prompt Add 5 zombie types with unique behaviors and visual indicators
```

### Phase 3: Scoring System
```
/create-prompt Create scoring with combos, accuracy bonuses, and a persistent leaderboard
```

### Phase 4: UI Polish
```
/create-prompt Add a professional UI with health bars, zombie portraits, wave counter, and score display
```

### Phase 5: Multiplayer
```
/create-prompt Implement real-time multiplayer where 2-4 players fight zombies together
```

Each of these becomes multiple prompts executed in parallel where possible!

---

## Pro Tips

### Combine with Regular Chat

You don't have to use meta-prompting for everything:

```
You: "Quick question - what's the best way to store zombie health?"
Me: [Direct answer]

You: "/create-prompt Now implement that health system with persistence"
Me: [Creates detailed prompt]
```

Use both approaches as needed!

---

### Iterate on Prompts

If result isn't perfect:

```
You: "The zombie animations are too fast"
Me: [Quick fix directly]

# OR

You: "/create-prompt Refine the zombie animation system with configurable speeds and smoother transitions"
Me: [Creates improved spec]
```

---

### Save Prompts as Documentation

Your `./prompts/` folder becomes documentation:
- Shows what features exist
- Explains why decisions were made
- Serves as onboarding for friends

---

## Keyboard Shortcuts

- Type `/` in chat to see all commands
- `/create-prompt` + Tab to autocomplete
- `/run-prompt last` to run most recent prompt

---

## What's Next?

Start building! Try this first prompt:

```
/create-prompt Add a wave-based zombie system where zombies spawn in increasing numbers each wave, with a 10-second break between waves.
```

See how it works, then build from there!

---

## Questions?

**"How do I see available prompts?"**
```bash
ls ./prompts/
```

**"How do I run an old prompt?"**
```bash
/run-prompt 001
```

**"Can I edit a prompt before running?"**
Yes! Just edit the `.md` file in `./prompts/`

**"What if I don't like the result?"**
The original prompt is archived in `./prompts/completed/` - you can always re-run or modify!

---

**Happy zombie slaying!** 🎯🧟‍♂️

Remember: **Describe what you want, not how to do it.** Claude figures out the "how"!
