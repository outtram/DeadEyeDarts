# DeadEyeDarts - Installation Guide for Friends

Hey! Troy wants you to try his zombie darts game. Here's how to get it running on your computer.

---

## What You'll Need

1. **Python 3** installed on your computer
2. **An autodarts.io account** with:
   - Your email address
   - Your password (**disable 2FA!**)
   - Your Board ID (from autodarts.io Board Manager)
3. **A physical autodarts board** OR you can use manual entry at play.autodarts.io

---

## Installation Steps

### Step 1: Install Python (if you don't have it)

**Mac:**
```bash
brew install python3
```

**Windows:**
Download from https://www.python.org/ (check "Add Python to PATH" during install)

**Linux:**
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip
```

---

### Step 2: Download the Code

Open Terminal (Mac/Linux) or Command Prompt (Windows) and run:

```bash
# Navigate to where you want to install it
cd ~/Desktop

# Clone Troy's game
git clone https://github.com/outtram/DeadEyeDarts.git

# Clone the required darts-caller software
git clone https://github.com/lbormann/darts-caller.git

# Move into the directory
cd DeadEyeDarts
```

---

### Step 3: Install Dependencies

**For darts-caller:**
```bash
cd ../darts-caller
pip3 install -r requirements.txt
cd ../DeadEyeDarts
```

**For DeadEyeDarts:**
```bash
pip3 install python-socketio urllib3
```

---

### Step 4: Configure Your Autodarts Credentials

You need to edit the `start_darts.sh` file with YOUR autodarts info.

**Mac/Linux:**
```bash
nano start_darts.sh
```

**Windows:**
Open `start_darts.sh` in Notepad or your favorite text editor.

**Find these lines and update them:**
```bash
-U "your-email@example.com" \
-P "your-password" \
-B "your-board-id" \
```

Replace with:
- Your autodarts.io email
- Your autodarts.io password (**make sure 2FA is disabled!**)
- Your board ID (find it at autodarts.io in Board Manager)

**Save the file!**

---

### Step 5: Make Scripts Executable (Mac/Linux only)

```bash
chmod +x start_darts.sh
chmod +x run_deadeyedarts.sh
```

---

### Step 6: Run the Game!

You need **TWO terminal windows open**:

**Terminal 1: Start darts-caller**
```bash
cd ~/Desktop/darts-caller
./start_darts.sh
```

Wait for: "CURRENT VOICE-PACK: ..." message
**Keep this running!**

---

**Terminal 2: Start DeadEyeDarts**
```bash
cd ~/Desktop/DeadEyeDarts
bash run_deadeyedarts.sh
```

Wait for: "🎯 DeadEyeDarts Connected to darts-caller!"
**Keep this running!**

---

### Step 7: Play!

1. Go to **https://play.autodarts.io/**
2. Start a game in **X01 mode** (501 or 301)
3. Throw darts at your board OR click manually on the web dartboard
4. Watch **Terminal 2** for your dart hits and zombie kills!

---

## Game Rules

- **Zombie Targets:** Numbers 11-20
- **Single hit:** Normal damage 💀
- **Double hit:** Extra damage ⚡⚡
- **Triple hit:** BONUS damage ⚡⚡⚡
- **Miss:** Any other number

---

## Troubleshooting

### "Python not found"
- Make sure Python 3 is installed: `python3 --version`

### "Connection Error"
- Make sure Terminal 1 (darts-caller) is running first
- Check your autodarts credentials in `start_darts.sh`

### "No dart events showing"
- Make sure you're playing **X01 mode** (not CountUp)
- Both terminal windows must be running

### SSL/HTTPS warnings
- These are normal! Ignore them, the game will still work

### "Can't find darts-caller"
- Make sure you cloned both repositories:
  - `git clone https://github.com/outtram/DeadEyeDarts.git`
  - `git clone https://github.com/lbormann/darts-caller.git`

---

## Directory Structure After Install

```
Desktop/
├── DeadEyeDarts/          # Troy's zombie game
│   ├── DeadEyeDarts/      # Game code
│   ├── start_darts.sh     # Start darts-caller
│   └── run_deadeyedarts.sh # Start the game
└── darts-caller/          # Required server software
```

---

## Stopping the Game

Press **Ctrl+C** in both terminal windows.

---

## Questions?

Ask Troy! Or check the full docs:
- `SETUP_FIRST_TIME.md` - Detailed setup
- `QUICK_START.md` - Quick reference
- `README.md` - Project overview

---

Have fun slaying zombies with darts! 🎯🧟‍♂️
