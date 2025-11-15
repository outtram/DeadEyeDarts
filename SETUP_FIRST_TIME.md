# DeadEyeDarts - First Time Setup Guide

Welcome! This guide will help you set up your zombie darts game for the first time.

## What is this project?

**DeadEyeDarts** is a zombie-themed darts game that connects to your autodarts.io board and displays real-time dart throws with custom zombie hit detection!

### What's included:

- **darts-caller/** - Third-party software that connects to autodarts.io (NOT your code)
- **DeadEyeDarts/** - YOUR zombie darts game client (this is YOUR code!)
- **start_darts.sh** - Script to start the darts-caller server
- **run_deadeyedarts.sh** - Script to start YOUR DeadEyeDarts game

---

## Prerequisites

Before you begin, make sure you have:

1. **Python 3.x installed**
   - Check: `python3 --version`
   - Mac: `brew install python3`
   - Windows: Download from https://www.python.org/

2. **An autodarts.io account**
   - Email address
   - Password (with 2FA disabled!)
   - Board ID (found in autodarts.io Board Manager)

3. **Physical autodarts board** (optional - you can use manual entry at play.autodarts.io)

---

## Step-by-Step Setup

### 1. Configure darts-caller (First Time Only)

The `start_darts.sh` script needs your autodarts credentials.

**Edit the script:**
```bash
nano start_darts.sh
```

**Find and update these lines:**
```bash
-U "your-email@example.com" \
-P "your-password" \
-B "your-board-id" \
```

Replace with your actual autodarts.io credentials:
- `-U` = Your autodarts.io email
- `-P` = Your autodarts.io password (make sure 2FA is disabled!)
- `-B` = Your board ID from autodarts.io Board Manager

**Save and exit** (Ctrl+O, Enter, Ctrl+X)

### 2. Make scripts executable (Mac/Linux only)

```bash
chmod +x start_darts.sh
chmod +x run_deadeyedarts.sh
```

### 3. Install Python dependencies

**For darts-caller:**
```bash
cd darts-caller
pip3 install -r requirements.txt
cd ..
```

**For DeadEyeDarts:**
```bash
pip3 install python-socketio
```

---

## First Launch

### Terminal 1: Start darts-caller server

```bash
./start_darts.sh
```

**What to expect:**
- First run downloads voice packs (takes 2-3 minutes)
- You'll see: "CURRENT VOICE-PACK: en-us-sage-female"
- Server runs on https://localhost:8079

**Keep this terminal running!**

### Terminal 2: Start DeadEyeDarts game

```bash
bash run_deadeyedarts.sh
```

**What to expect:**
```
🎯 DeadEyeDarts Connected to darts-caller!
Waiting for dart throws...
```

**Keep this terminal running too!**

---

## Playing Your First Game

1. **Go to https://play.autodarts.io/**

2. **Start a game in X01 mode** (501 or 301)
   - **Important:** DeadEyeDarts needs X01 mode for individual dart tracking!
   - CountUp mode only shows turn totals, not individual darts

3. **Throw darts!**
   - Physical darts: Throw at your autodarts board
   - Manual entry: Click on the dartboard at play.autodarts.io

4. **Watch Terminal 2** for your dart hits!
   - Zombie targets: 11-20
   - Triples give bonus damage!
   - Doubles give extra damage!

---

## Troubleshooting

### "Connection Error" in DeadEyeDarts
- Make sure darts-caller is running in Terminal 1
- Check that start_darts.sh has correct credentials

### "No dart events showing"
- Make sure you're playing X01 mode (not CountUp)
- Check that both terminals are running
- Throw darts or manually enter them at play.autodarts.io

### SSL Warning (Unverified HTTPS)
- This is normal! The warning is expected for localhost connections
- It doesn't affect functionality

### Python module errors
```bash
pip3 install python-socketio urllib3
```

---

## Project Structure

```
CODE/
├── darts-caller/           # Third-party autodarts connector (NOT your code)
│   ├── darts-caller.py    # Server that connects to autodarts.io
│   └── requirements.txt   # Dependencies
├── DeadEyeDarts/          # YOUR zombie darts game!
│   └── deadeyedarts_client.py  # YOUR game logic
├── darts-media/           # Voice packs (auto-downloaded)
├── darts-venv/            # Python virtual environment (auto-created)
├── start_darts.sh         # Start darts-caller server
├── run_deadeyedarts.sh    # Start YOUR game
└── SETUP_FIRST_TIME.md    # This file!
```

---

## Next Steps

Once everything is working:
1. Read `QUICK_START.md` for daily usage
2. Modify `DeadEyeDarts/deadeyedarts_client.py` to build your zombie game!
3. Have fun! 🎯🧟‍♂️

---

## Need Help?

- Check darts-caller docs: `darts-caller/README.md`
- autodarts.io support: https://autodarts.io
- Make sure 2FA is disabled on your autodarts account
