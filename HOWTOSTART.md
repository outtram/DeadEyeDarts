# How to Start DeadEyeGames

Quick reference for starting up the dart gaming platform.

## Prerequisites

Make sure you have:
- Python 3.7+ installed
- Your autodarts board configured
- Two terminal windows open

---

## Startup Commands

You need **TWO terminals** running simultaneously:

### Terminal 1: Start darts-caller

```bash
cd ~/CODE
./start_darts.sh
```

**Wait for:** "CURRENT VOICE-PACK: ..." message

**Keep this running!**

---

### Terminal 2: Start DeadEyeGames

```bash
cd ~/CODE/DeadEyeGames
./run_games.sh
```

**Wait for:** Browser opens to http://localhost:5000

**Keep this running!**

---

## That's It!

Your browser should automatically open to the DeadEyeGames homepage.

1. Wait for green "Connected" status
2. Click "Zombie Slayer" or "HEIST CREW"
3. Start playing!

---

## Stopping

Press `Ctrl+C` in both terminal windows when done.

---

## Troubleshooting

**Problem:** Connection shows "Disconnected"
- Make sure Terminal 1 (darts-caller) started successfully first

**Problem:** Browser doesn't open
- Manually go to http://localhost:5000

**Problem:** Port 5001 already in use
- The script automatically kills old processes on port 5001

---

## More Help

- **DeadEyeGames docs:** See `DeadEyeGames/START_HERE.md`
- **Archived docs:** See `_archive/` folder for old setup guides
