# DeadEyeGames Quick Start Guide

Get up and running in 60 seconds! ⚡

## Mac Users

```bash
cd ~/CODE/DeadEyeGames
./run_games.sh
```

**That's it!** Your browser will open automatically to http://localhost:5000

---

## Windows Users

```cmd
cd C:\Users\YourUsername\CODE\DeadEyeGames
run_games.bat
```

**That's it!** Your browser will open automatically to http://localhost:5000

---

## What Happens Next?

1. ✅ Virtual environment is created (first time only)
2. ✅ Dependencies are installed (first time only)
3. ✅ Server starts at http://localhost:5000
4. ✅ Browser opens to homepage
5. ✅ Connection established to darts-caller

---

## Playing Your First Game

1. **Wait for connection**: Green "Connected" indicator at top of page
2. **Click "Zombie Slayer"**: Opens the game
3. **Click "START GAME"**: Game begins!
4. **Throw darts**: Hit the numbers shown on the zombies
5. **Have fun!** Kill zombies and rack up points

---

## Controls

- **Start Game**: Click the START GAME button
- **Play**: Throw physical darts at your autodarts board
- **Restart**: Click PLAY AGAIN after game over
- **Home**: Click "← Back to Home" to return to game selection

---

## Stopping the Server

In the terminal where the server is running:

**Mac/Windows**: Press `Ctrl+C`

---

## Troubleshooting (Quick Fix)

| Problem | Solution |
|---------|----------|
| Can't find script | Make sure you're in the DeadEyeGames folder |
| Python not found | Install Python 3.7+ from python.org |
| Port already in use | Stop other services or change port in server.py |
| Darts not detected | Ensure darts-caller is running at https://localhost:8079 |
| Browser doesn't open | Manually go to http://localhost:5000 |

---

## File Locations

- **Mac**: `~/CODE/DeadEyeGames/`
- **Windows**: `C:\Users\YourUsername\CODE\DeadEyeGames\`

---

## Need More Help?

- Read **INSTALL.md** for detailed setup instructions
- Read **README.md** for game rules and technical details
- Check browser console (F12) for error messages
- Check terminal output for server logs

---

## Game Rules - Zombie Slayer

🧟 **Objective**: Kill zombies by hitting their target numbers

**How to Play:**
- 2 zombies appear with random numbers (1-20)
- Hit the correct number to kill that zombie
- New zombie spawns immediately with new number
- Miss 3 times = Game Over

**Scoring:**
- Single (1x): 100 points
- Double (2x): 200 points
- Triple (3x): 300 points

**Tips:**
- Focus on accuracy over speed
- Doubles and triples give bonus points
- Watch your miss counter - stay under 3!

---

## Requirements Checklist

Before starting, make sure you have:

- ✅ Python 3.7 or newer installed
- ✅ darts-caller running at https://localhost:8079
- ✅ autodarts board connected and working
- ✅ Modern web browser (Chrome, Firefox, Safari, Edge)

---

## First Time Setup Time

- **Installation**: ~2 minutes (automatic)
- **Learning the game**: ~1 minute
- **First game**: ~5 minutes

**Total to first dart throw**: ~3 minutes! 🎯

---

## Daily Usage

After initial setup, starting the game takes:

1. Run startup script: 5 seconds
2. Wait for browser: 2 seconds
3. Select game: 1 second
4. Start playing: **Instant!**

**Total**: ~10 seconds from script to gameplay! ⚡

---

## Commands Reference

### Start Server
**Mac**: `./run_games.sh`
**Windows**: `run_games.bat`

### Stop Server
**Both**: Press `Ctrl+C` in terminal

### Check Python Version
**Mac**: `python3 --version`
**Windows**: `python --version`

### Delete Virtual Environment (Reset)
**Mac**: `rm -rf venv`
**Windows**: `rmdir /s venv`

---

## URLs

- **Homepage**: http://localhost:5000
- **Zombie Slayer**: http://localhost:5000/games/zombie-slayer
- **darts-caller**: https://localhost:8079

---

## Tips for Best Experience

1. **Full Screen**: Press F11 in browser for immersive gaming
2. **Audio**: Turn up volume for the full cyberpunk vibe
3. **Lighting**: Play in a dim room for that neon glow effect
4. **Practice**: Start with Zombie Slayer to get familiar with dart detection

---

## What's Next?

Once you've mastered Zombie Slayer:

- Check README.md for upcoming games
- Explore the modular architecture
- Add your own custom games!
- Customize the cyberpunk theme

---

**Ready? Let's play!** 🎯🧟✨

*Run the startup script and start slaying zombies!*
