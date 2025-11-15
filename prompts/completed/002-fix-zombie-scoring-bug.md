<objective>
Fix critical bug in Zombie Slayer game where kills and misses are being double-counted. Each zombie kill should increment the kill counter by exactly 1, and each miss should increment the miss counter by exactly 1. Currently, both counters are incrementing by 2 each time.

End goal: Accurate scoring that reflects the actual number of zombies killed and darts missed, providing correct game feedback to the player.
</objective>

<context>
Project: DeadEyeGames - Retro cyberpunk gaming platform
Game: Zombie Slayer (located in @DeadEyeGames/games/zombie-slayer/)
Bug Impact: Players see incorrect statistics, making the game frustrating and confusing
Current Behavior: Killing 1 zombie shows 2 kills, missing 1 dart shows 2 misses
Expected Behavior: Killing 1 zombie shows 1 kill, missing 1 dart shows 1 miss

The game receives dart throw events from the darts-caller via WebSocket and processes them to determine hits/misses.
</context>

<requirements>
1. **Identify the Root Cause:**
   - Examine the dart event handling logic in the zombie game JavaScript
   - Determine why counters are incrementing twice per event
   - Check for duplicate event listeners or double-processing of events

2. **Fix the Double-Counting:**
   - Ensure kills counter increments by exactly 1 per zombie killed
   - Ensure misses counter increments by exactly 1 per dart missed
   - Maintain all other game functionality (zombie spawning, game over, scoring)

3. **Preserve Existing Features:**
   - Keep the 2-zombie display
   - Keep the 3-strike game over mechanic
   - Keep the multiplier scoring system (single/double/triple)
   - Keep all visual animations and feedback

4. **No Other Changes:**
   - Don't modify the game mechanics beyond fixing the counter bug
   - Don't change the UI or styling
   - Don't alter the WebSocket connection logic
</requirements>

<implementation>
Files to Check:
- @DeadEyeGames/games/zombie-slayer/zombie.js - Main game logic
- @DeadEyeGames/static/js/darts-client.js - WebSocket event handling

Common Causes of Double-Counting:
1. **Event listener registered multiple times** - Check if game initialization happens twice
2. **Event handler called twice** - Check if the same event triggers multiple handlers
3. **Increment happens in multiple places** - Check if counter is incremented in both hit detection and UI update
4. **WebSocket duplicate events** - Check if darts-caller sends duplicate messages

What to Look For:
- Multiple `addEventListener` or event handler registrations
- Counter increments in loops that execute twice
- Global variables being updated in multiple callback functions
- Event propagation causing duplicate processing

Fix Strategy:
1. Read the zombie.js file to understand the game flow
2. Identify where kills and misses are incremented
3. Determine why incrementing happens twice
4. Apply minimal fix to ensure single increment per event
5. Test the logic flow mentally to verify the fix
</implementation>

<output>
Modify the file at:
- `./DeadEyeGames/games/zombie-slayer/zombie.js`

Only modify the sections causing the double-counting bug. Do not change:
- HTML structure
- CSS styling
- Other game mechanics that work correctly
- WebSocket connection code (unless that's the source of duplicates)
</output>

<verification>
Before declaring complete, verify:

1. **Logic Check:**
   - Trace through the code path when a dart is thrown
   - Confirm kills counter increments exactly once when zombie is hit
   - Confirm misses counter increments exactly once when dart misses
   - Ensure no duplicate event handlers or listeners

2. **Flow Analysis:**
   - Check that game initialization happens only once
   - Verify event handlers are registered once
   - Confirm counters are incremented in only one location per event

3. **Edge Cases:**
   - Game restart should not add duplicate handlers
   - Multiple zombies with same number should still count as 1 kill
   - Game over should not affect counter logic

4. **Code Quality:**
   - Explain what was causing the double-count
   - Document the fix with clear comments
   - Ensure the solution is clean and maintainable
</verification>

<success_criteria>
The bug fix is successful when:
- ✅ Killing 1 zombie increments kill counter by exactly 1
- ✅ Missing 1 dart increments miss counter by exactly 1
- ✅ All other game functionality remains unchanged
- ✅ Game restart/replay works correctly without accumulating handlers
- ✅ Code clearly documents what was fixed and why
- ✅ No new bugs introduced by the fix
</success_criteria>

<debugging_notes>
If you find the bug is in the event handling:
- Look for multiple registrations of the same handler
- Check if DartsClient.init() is called multiple times
- Verify that old event handlers are cleaned up on game restart

If you find the bug is in the game logic:
- Check if the increment happens in a loop
- Look for duplicate function calls
- Verify that hit detection doesn't call increment multiple times

Common Pattern to Watch For:
```javascript
// BAD - This might increment twice if called from multiple places
function handleDart(dart) {
    if (isHit) {
        kills++;  // First increment
        updateZombie();
    }
}

function updateZombie() {
    kills++;  // Second increment - BUG!
    spawnNewZombie();
}
```

The fix should ensure each logical action (kill/miss) increments its counter exactly once.
</debugging_notes>
