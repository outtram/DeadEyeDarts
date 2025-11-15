# DeadEyeDarts - Quick Start Guide

Already set up? Here's how to run your zombie darts game!

---

## Quick Launch (Every Time)

You need **2 terminal windows** running simultaneously:

### Terminal 1: Start darts-caller
```bash
cd ~/CODE/darts-caller
./start_darts.sh
```

**Wait for:** "CURRENT VOICE-PACK: ..." message

**Keep running!** ✅

---

### Terminal 2: Start DeadEyeDarts
```bash
cd ~/CODE
bash run_deadeyedarts.sh
```

**Wait for:** "🎯 DeadEyeDarts Connected to darts-caller!"

**Keep running!** ✅

---

## Play

1. **Go to:** https://play.autodarts.io/
2. **Start X01 game** (501 or 301)
3. **Throw darts!**
4. **Watch Terminal 2** for zombie hits!

---

## Important Reminders

- **Use X01 mode** (501/301) for individual dart tracking
- **Both terminals** must stay open
- **Zombie targets:** Numbers 11-20
- **Bonus damage:** Triples (⚡⚡⚡) and Doubles (⚡⚡)

---

## Stopping

Press **Ctrl+C** in both terminal windows when done.

---

## Troubleshooting

**Problem:** "Connection Error" in Terminal 2
- **Fix:** Make sure Terminal 1 is running first

**Problem:** No dart events showing
- **Fix:** Make sure you're playing X01 mode (not CountUp)

**Problem:** Need to reconfigure darts-caller
- **Fix:** Edit `start_darts.sh` with your autodarts credentials

---

## One-Line Startup (Advanced)

If you want to run both in one terminal:
```bash
cd ~/CODE/darts-caller && ./start_darts.sh &
sleep 3 && cd ~/CODE && bash run_deadeyedarts.sh
```

---

Happy dart throwing! 🎯🧟‍♂️
