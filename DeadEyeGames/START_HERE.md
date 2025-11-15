# 🎯 START HERE - DeadEyeGames

Welcome to DeadEyeGames! This is your quick navigation guide.

---

## 🚀 Just Want to Play?

**Run this command:**

```bash
./run_games.sh
```

Your browser will open automatically. Click "Zombie Slayer" and start playing!

---

## 📚 What Should I Read?

### If you want to...

**Play the game right now** → Read **QUICKSTART.md** (60 seconds)

**Set up for the first time** → Read **INSTALL.md** (detailed guide)

**Understand how it works** → Read **README.md** (overview)

**Add your own game** → Read **DEVELOPER.md** (tutorial)

**See what was built** → Read **PROJECT_SUMMARY.md** (technical details)

**Verify everything works** → Read **VERIFICATION_CHECKLIST.md** (QA list)

**Get project overview** → Read **DELIVERY_SUMMARY.md** (executive summary)

---

## 🎮 Quick Reference

### Starting the Game

**Mac/Linux:**
```bash
cd ~/CODE/DeadEyeGames
./run_games.sh
```

**Windows:**
```cmd
cd C:\Users\YourUsername\CODE\DeadEyeGames
run_games.bat
```

### Stopping the Game

Press `Ctrl+C` in the terminal where the server is running.

### URLs

- **Homepage**: http://localhost:5000
- **Zombie Slayer**: http://localhost:5000/games/zombie-slayer
- **darts-caller**: https://localhost:8079

---

## 📁 Project Structure

```
DeadEyeGames/
│
├── 🚀 START HERE!
│   ├── START_HERE.md (this file)
│   └── QUICKSTART.md (60-second guide)
│
├── 📖 Documentation
│   ├── README.md (main documentation)
│   ├── INSTALL.md (installation guide)
│   ├── DEVELOPER.md (add new games)
│   ├── PROJECT_SUMMARY.md (technical details)
│   ├── DELIVERY_SUMMARY.md (project overview)
│   └── VERIFICATION_CHECKLIST.md (QA checklist)
│
├── 🎮 Run These
│   ├── run_games.sh (Mac/Linux startup)
│   └── run_games.bat (Windows startup)
│
├── ⚙️ Configuration
│   ├── server.py (Flask server)
│   └── requirements.txt (dependencies)
│
├── 🎨 Static Assets
│   ├── static/css/cyberpunk.css (theme)
│   ├── static/js/darts-client.js (WebSocket)
│   └── static/images/ (assets)
│
├── 🌐 Pages
│   └── templates/homepage.html
│
└── 🎯 Games
    └── zombie-slayer/
        ├── zombie.html
        ├── zombie.css
        └── zombie.js
```

---

## 🎯 What is DeadEyeGames?

A retro 90's cyberpunk-themed gaming platform that turns your autodarts board into an arcade system. Throw real darts to play engaging mini-games!

**Current Game:**
- **Zombie Slayer** - Kill zombies by hitting their target numbers!

---

## ✅ Quick Checklist

Before starting, make sure you have:

- [x] Python 3.7 or newer
- [x] darts-caller running at https://localhost:8079
- [x] autodarts board connected
- [x] Modern web browser

---

## 🆘 Need Help?

### Common Issues

**"Connection disconnected"**
→ Start darts-caller first, then run DeadEyeGames

**"Python not found"**
→ Install Python 3.7+ from python.org

**"Permission denied" (Mac)**
→ Run: `chmod +x run_games.sh`

**Browser doesn't open**
→ Manually go to: http://localhost:5000

### More Help

- Check **INSTALL.md** for detailed troubleshooting
- Check browser console (F12) for errors
- Check terminal output for server logs

---

## 🎨 What You'll See

**Homepage:**
- Retro cyberpunk aesthetic (neon colors, grid background, scanlines)
- Connection status indicator
- Game selection cards
- Instructions

**Zombie Slayer:**
- 2 zombies with target numbers
- Real-time dart detection
- Score, kills, and miss tracking
- Visual feedback for hits/misses
- Game over screen with stats

---

## 🔧 Technical Details

**Architecture:**
```
Autodarts Board → darts-caller → Flask Server → Browser → Game
```

**Tech Stack:**
- Python Flask (backend)
- Socket.IO (real-time communication)
- Vanilla JavaScript (frontend)
- Custom CSS (cyberpunk theme)

---

## 🎓 Learning Resources

### Want to Add Your Own Game?

1. Read **DEVELOPER.md** for complete tutorial
2. Copy the zombie-slayer folder as a template
3. Modify game logic, styling, and mechanics
4. Add route to server.py
5. Add card to homepage.html
6. Done!

**Time to add new game:** < 1 hour

---

## 📈 Next Steps

1. **Play Now** → Run `./run_games.sh`
2. **Master the Game** → Try to beat your high score
3. **Explore the Code** → See how it works
4. **Create New Game** → Add your own game mode
5. **Share with Friends** → Show off your gaming platform!

---

## 🎉 Have Fun!

DeadEyeGames is ready to play. Throw some darts and slay some zombies! 🎯🧟✨

---

**Quick Start Command:**
```bash
./run_games.sh
```

**That's it! Enjoy!**
