# DeadEyeGames - Installation Guide for Friends

Hey! Troy wants you to try his retro cyberpunk dart games. Here's how to get everything running on your computer.

---

## What You'll Need

1. **Python 3.7+** installed on your computer
2. **An autodarts.io account** with:
   - Your email address
   - Your password (**disable 2FA!**)
   - Your Board ID (from autodarts.io Board Manager)
3. **A physical autodarts board** OR you can use manual entry at play.autodarts.io
4. **Git** installed (for cloning the repository)

---

## Step-by-Step Installation

### Step 1: Install Prerequisites

#### Python Installation

**Mac:**
```bash
# Check if you have Python 3.7+
python3 --version

# If not, install via Homebrew (recommended)
brew install python3

# OR download from https://www.python.org/downloads/
```

**Windows:**
1. Download Python from https://www.python.org/downloads/
2. **IMPORTANT:** Check "Add Python to PATH" during installation!
3. Verify installation:
   ```cmd
   python --version
   ```

#### Git Installation

**Mac:**
```bash
# Check if you have git
git --version

# If not, install via Homebrew
brew install git
```

**Windows:**
Download from https://git-scm.com/download/win

---

### Step 2: Clone the Repository

Open Terminal (Mac) or Command Prompt (Windows):

```bash
# Navigate to where you want to install (e.g., your home directory)
cd ~

# Clone Troy's game repository
git clone https://github.com/outtram/DeadEyeDarts.git

# This creates a folder called "DeadEyeDarts" - let's rename it to CODE
mv DeadEyeDarts CODE

# Navigate into the folder
cd CODE

# Clone the required darts-caller software (third-party)
git clone https://github.com/lbormann/darts-caller.git
```

**Windows users:** If `mv` doesn't work, use:
```cmd
rename DeadEyeDarts CODE
```

---

### Step 3: Configure Your Autodarts Credentials

You need to edit `start_darts.sh` with YOUR autodarts.io credentials.

**Mac:**
```bash
cd ~/CODE
nano start_darts.sh
```

**Windows:**
```cmd
cd C:\Users\YourUsername\CODE
notepad start_darts.sh
```

**Find these lines (around line 115):**
```bash
-U "your-email@example.com" \
-P "your-password" \
-B "your-board-id" \
```

**Replace with:**
- `-U` = Your autodarts.io email
- `-P` = Your autodarts.io password (**make sure 2FA is disabled!**)
- `-B` = Your board ID (find it in autodarts.io Board Manager)

**Example:**
```bash
-U "john@example.com" \
-P "MyPassword123" \
-B "9ee38305-e258-4e20-af39-f66fb477de46" \
```

**Save the file:**
- Mac (nano): Press `Ctrl+O`, then `Enter`, then `Ctrl+X`
- Windows (notepad): Click File → Save

---

### Step 4: Make Scripts Executable (Mac/Linux only)

```bash
cd ~/CODE
chmod +x start_darts.sh
cd DeadEyeGames
chmod +x run_games.sh
```

**Windows users:** Skip this step!

---

### Step 5: First Run (Automatic Setup!)

Great news! The virtual environment system means **NO manual installation needed!**

The scripts will automatically:
- ✅ Create isolated virtual environments
- ✅ Install all Python dependencies
- ✅ Download voice packs (for darts-caller)
- ✅ Configure everything properly

You need **TWO terminal windows open**:

#### Terminal 1: Start darts-caller

**Mac:**
```bash
cd ~/CODE
./start_darts.sh
```

**Windows:**
```bash
cd C:\Users\YourUsername\CODE
bash start_darts.sh
```

**First run will:**
- Create virtual environment (`darts-venv/`) - takes 2-3 minutes
- Install dependencies automatically
- Download voice packs
- Connect to autodarts.io

**Wait for:** "CURRENT VOICE-PACK: en-us-sage-female" message

**Keep this terminal running!**

---

#### Terminal 2: Start DeadEyeGames

**Mac:**
```bash
cd ~/CODE/DeadEyeGames
./run_games.sh
```

**Windows:**
```bash
cd C:\Users\YourUsername\CODE\DeadEyeGames
bash run_games.sh
```

**First run will:**
- Create virtual environment (`venv/`) - takes 30 seconds
- Install Flask, Socket.IO, and other dependencies
- Start the web server
- Open your browser automatically

**Wait for:** Browser opens to http://localhost:5000

**Keep this terminal running too!**

---

### Step 6: Play!

1. Your browser should automatically open to http://localhost:5000
2. Wait for green "Connected" status indicator at the top
3. Click on a game:
   - **Zombie Slayer** - Solo zombie killing game
   - **HEIST CREW** - 3-player cooperative heist missions
4. Start playing!

---

## Virtual Environments Explained

### What are virtual environments?

Think of them as isolated "bubbles" for Python packages. Each project gets its own bubble with its own versions of everything.

### Why is this awesome?

- ✅ **No conflicts:** Different projects can use different package versions
- ✅ **Clean system:** Your main Python installation stays clean
- ✅ **Works everywhere:** Same setup on every computer
- ✅ **No manual install:** Scripts handle everything automatically
- ✅ **Repeatable:** Delete and recreate anytime

### How does it work in this project?

```
CODE/
├── start_darts.sh         # Creates darts-venv/ on first run
├── darts-venv/            # Virtual environment for darts-caller
│   └── (Flask, SocketIO, etc.)
└── DeadEyeGames/
    ├── run_games.sh       # Creates venv/ on first run
    └── venv/              # Virtual environment for DeadEyeGames
        └── (Flask, SocketIO, etc.)
```

**On first run:** Takes 2-3 minutes to set up everything
**Every run after:** Starts in seconds!

### Do I need to install anything manually?

**NO!** The scripts detect if virtual environments exist and:
1. Create them if missing
2. Activate them
3. Install dependencies if needed
4. Run the application

You never touch `pip install` or `requirements.txt` manually!

---

## Subsequent Runs (After First Time)

Once everything is set up, starting the games is super quick:

**Terminal 1:**
```bash
cd ~/CODE
./start_darts.sh
```
(Starts in ~5 seconds)

**Terminal 2:**
```bash
cd ~/CODE/DeadEyeGames
./run_games.sh
```
(Starts in ~3 seconds)

**Total time to gameplay:** ~10 seconds! 🚀

---

## Troubleshooting

### "Python not found"

**Mac:**
```bash
brew install python3
```

**Windows:**
Reinstall Python from python.org and **check "Add Python to PATH"**

---

### "git command not found"

**Mac:**
```bash
brew install git
```

**Windows:**
Download and install from https://git-scm.com/download/win

---

### "Permission denied" (Mac only)

```bash
chmod +x start_darts.sh
cd DeadEyeGames
chmod +x run_games.sh
```

---

### "Connection Error" or "Disconnected" status

1. Make sure Terminal 1 (darts-caller) is running first
2. Check your autodarts credentials in `start_darts.sh`
3. Verify 2FA is disabled on your autodarts.io account

---

### "Port already in use"

**Mac:**
```bash
# Kill process on port 5000 (DeadEyeGames)
lsof -ti:5000 | xargs kill

# Kill process on port 8079 (darts-caller)
lsof -ti:8079 | xargs kill
```

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

---

### Virtual environment issues

If something goes wrong, just delete and recreate:

**Mac/Linux:**
```bash
rm -rf ~/CODE/darts-venv
rm -rf ~/CODE/DeadEyeGames/venv
# Run the scripts again - they'll recreate everything
```

**Windows:**
```cmd
rmdir /s C:\Users\YourUsername\CODE\darts-venv
rmdir /s C:\Users\YourUsername\CODE\DeadEyeGames\venv
```

---

### Browser doesn't open automatically

Manually navigate to: http://localhost:5000

---

### Darts not detected in the game

1. Make sure you're playing on autodarts.io (or throwing at your physical board)
2. Check that both terminals are running
3. Verify green "Connected" status in the browser
4. Check browser console for errors (press F12 → Console tab)

---

## Directory Structure After Install

```
CODE/
├── start_darts.sh             # Start darts-caller (Terminal 1)
├── darts-venv/                # Virtual env (auto-created)
├── darts-caller/              # Third-party autodarts connector
├── darts-media/               # Voice packs (auto-downloaded)
├── DeadEyeGames/              # Main game platform
│   ├── run_games.sh           # Start games server (Terminal 2)
│   ├── venv/                  # Virtual env (auto-created)
│   ├── server.py              # Flask server
│   └── games/                 # Game folders
│       ├── zombie-slayer/
│       └── heist-crew/
└── DeadEyeDarts/              # Legacy Python CLI game
```

**Note:** `*-venv/` folders are created automatically and are NOT in git!

---

## Updating the Games

When Troy pushes updates:

```bash
cd ~/CODE
git pull
```

Then restart both terminals - the scripts will update dependencies if needed!

---

## Stopping the Games

Press `Ctrl+C` in **both terminal windows**.

---

## Game Rules Quick Reference

### Zombie Slayer 🧟
- Kill zombies by hitting their target numbers
- Miss 3 times = Game Over
- Singles: 100 points, Doubles: 200 points, Triples: 300 points

### HEIST CREW 🎯
- 3-player cooperative missions
- Choose role: Hacker, Infiltrator, or Demolitions
- Complete 5 story-driven heist missions
- Manage time and alert levels

---

## Need More Help?

- **Quick startup:** See `HOWTOSTART.md` in the CODE folder
- **DeadEyeGames docs:** See `DeadEyeGames/START_HERE.md`
- **Main README:** See `README.md` in CODE folder

Ask Troy if you get stuck!

---

## Summary for the Impatient

1. Install Python 3.7+ and Git
2. Clone repo: `git clone https://github.com/outtram/DeadEyeDarts.git`
3. Rename to CODE: `mv DeadEyeDarts CODE`
4. Clone darts-caller: `cd CODE && git clone https://github.com/lbormann/darts-caller.git`
5. Edit `start_darts.sh` with your autodarts credentials
6. Make scripts executable (Mac): `chmod +x start_darts.sh DeadEyeGames/run_games.sh`
7. Terminal 1: `./start_darts.sh`
8. Terminal 2: `cd DeadEyeGames && ./run_games.sh`
9. Play at http://localhost:5000

**First time:** Takes ~5 minutes (automatic setup)
**Every time after:** Takes ~10 seconds!

---

Have fun playing! 🎯🧟✨
