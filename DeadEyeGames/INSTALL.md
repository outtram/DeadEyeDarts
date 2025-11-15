# DeadEyeGames Installation Guide

Complete setup instructions for Mac and Windows users.

## Prerequisites

Before installing DeadEyeGames, ensure you have:

1. **Python 3.7 or newer** installed
2. **darts-caller** installed and configured
3. **autodarts board** set up and working
4. Modern web browser (Chrome, Firefox, Safari, or Edge)

---

## Installation Steps

### For Mac Users

#### Step 1: Verify Python Installation

Open Terminal and check your Python version:

```bash
python3 --version
```

You should see something like `Python 3.11.x` or newer. If not, install Python from [python.org](https://www.python.org/downloads/).

#### Step 2: Navigate to DeadEyeGames

```bash
cd ~/CODE/DeadEyeGames
```

(Adjust path if you placed it elsewhere)

#### Step 3: Run the Startup Script

```bash
./run_games.sh
```

**First Run**: The script will:
- Create a virtual environment
- Install all dependencies
- Start the Flask server
- Open your browser automatically

**Subsequent Runs**: Just execute `./run_games.sh` - everything is already set up!

#### Step 4: Play!

Your browser should open to http://localhost:5000. If not, manually navigate there.

---

### For Windows Users

#### Step 1: Verify Python Installation

Open Command Prompt and check your Python version:

```cmd
python --version
```

You should see `Python 3.11.x` or newer. If not, install Python from [python.org](https://www.python.org/downloads/).

**Important**: During Python installation, check "Add Python to PATH"!

#### Step 2: Navigate to DeadEyeGames

```cmd
cd C:\Users\YourUsername\CODE\DeadEyeGames
```

(Adjust path if you placed it elsewhere)

#### Step 3: Run the Startup Script

```cmd
run_games.bat
```

**First Run**: The script will:
- Create a virtual environment
- Install all dependencies
- Start the Flask server
- Open your browser automatically

**Subsequent Runs**: Just double-click `run_games.bat` or run it from Command Prompt!

#### Step 4: Play!

Your browser should open to http://localhost:5000. If not, manually navigate there.

---

## Verifying Installation

### 1. Check Server Status

After running the startup script, you should see:

```
╔══════════════════════════════════════════════════════════════════════╗
║              RETRO CYBERPUNK DART GAMING PLATFORM                   ║
╚══════════════════════════════════════════════════════════════════════╝

    Server: http://localhost:5000
    Darts-Caller: https://localhost:8079

✓ Python 3 found
✓ Virtual environment activated
✓ Dependencies installed
✓ darts-caller is running
```

### 2. Check Browser Connection

In your browser at http://localhost:5000:
- Connection status indicator should show "Connected" (green)
- Homepage should display with cyberpunk styling
- Game cards should be visible

### 3. Test Dart Detection

1. Click "Zombie Slayer" to start a game
2. Click "START GAME"
3. Throw a dart at your autodarts board
4. Game should respond to your dart throw in real-time

---

## Troubleshooting

### Python Not Found

**Mac:**
```bash
# Check if Python 3 is installed
which python3

# If not found, install via Homebrew
brew install python3

# Or download from python.org
```

**Windows:**
```cmd
# Reinstall Python from python.org
# Make sure to check "Add Python to PATH" during installation
```

### Permission Denied (Mac)

If you get "Permission denied" when running `run_games.sh`:

```bash
chmod +x run_games.sh
./run_games.sh
```

### Port Already in Use

If port 5000 is already in use:

1. Find and stop the process using port 5000:

**Mac:**
```bash
lsof -ti:5000 | xargs kill
```

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

2. Or edit `server.py` and change the port:
```python
web_socketio.run(app, host='0.0.0.0', port=5001, debug=False)
```

### darts-caller Not Detected

If connection status shows "Disconnected":

1. Ensure darts-caller is running
2. Check it's accessible at https://localhost:8079
3. In browser, open developer console (F12) and check for error messages

### Dependencies Installation Failed

**Mac:**
```bash
# Delete virtual environment and try again
rm -rf venv
./run_games.sh
```

**Windows:**
```cmd
# Delete virtual environment and try again
rmdir /s venv
run_games.bat
```

### Browser Doesn't Open Automatically

Manually navigate to: http://localhost:5000

---

## Manual Installation (Advanced)

If you prefer to set up manually:

### 1. Create Virtual Environment

**Mac/Linux:**
```bash
cd DeadEyeGames
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```cmd
cd DeadEyeGames
python -m venv venv
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Start Server

```bash
python server.py
```

### 4. Open Browser

Navigate to: http://localhost:5000

---

## Uninstallation

To remove DeadEyeGames:

1. Stop the server (Ctrl+C in the terminal)
2. Delete the DeadEyeGames folder:

**Mac:**
```bash
rm -rf ~/CODE/DeadEyeGames
```

**Windows:**
```cmd
rmdir /s C:\Users\YourUsername\CODE\DeadEyeGames
```

---

## Updating DeadEyeGames

When new games or features are added:

1. Stop the server (Ctrl+C)
2. Replace files with updated versions
3. Restart with the startup script

The virtual environment and dependencies will be automatically updated if needed.

---

## System Requirements

### Minimum Requirements
- **OS**: macOS 10.13+, Windows 10+, or Linux
- **RAM**: 512 MB available
- **Disk**: 100 MB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Network**: Local network access for darts-caller connection

### Recommended Requirements
- **OS**: macOS 12+, Windows 11+
- **RAM**: 1 GB available
- **Disk**: 500 MB free space
- **Browser**: Latest version of Chrome, Firefox, Safari, or Edge
- **Network**: Stable local network connection

---

## Getting Help

### Check Logs

Server logs appear in the terminal where you ran the startup script. Look for error messages there.

### Enable Debug Mode

Edit `server.py` and change:
```python
web_socketio.run(app, host='0.0.0.0', port=5000, debug=True)
```

### Browser Console

Press F12 in your browser and check the Console tab for JavaScript errors.

### Common Error Messages

| Error | Solution |
|-------|----------|
| `Connection Error` | Ensure darts-caller is running |
| `Port already in use` | Stop other services on port 5000 |
| `Module not found` | Reinstall dependencies |
| `Python not found` | Install Python 3.7+ |

---

## Next Steps

Once installed and running:

1. **Read the README.md** for game instructions and features
2. **Play Zombie Slayer** to test dart detection
3. **Explore adding new games** using the modular structure
4. **Customize styling** in `static/css/cyberpunk.css`

Happy gaming! 🎯🧟✨
