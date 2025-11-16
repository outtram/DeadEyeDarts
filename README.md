# 🎯 DeadEyeDarts & DeadEyeGames

Retro cyberpunk dart gaming platform that connects to your autodarts.io board!

## Quick Start

**Already installed?** → Read **[HOWTOSTART.md](HOWTOSTART.md)** (2 simple commands!)

**First time setup?** → Read **[INSTALL_FOR_FRIENDS.md](INSTALL_FOR_FRIENDS.md)** (complete guide!)

## What's in this repository?

### DeadEyeGames (Main Project) 🎮
Web-based retro cyberpunk gaming platform with multiple dart games:
- **Zombie Slayer** - Kill zombies by hitting their numbers
- **HEIST CREW** - 3-player cooperative heist missions

📁 Location: `DeadEyeGames/`
📖 Docs: See `DeadEyeGames/START_HERE.md`

### DeadEyeDarts (Legacy) 🧟
Original Python CLI zombie game (archived but still functional)

📁 Location: `DeadEyeDarts/`
📖 Archived docs: See `_archive/` folder

## Project Structure

```
CODE/
├── HOWTOSTART.md              # ⭐ START HERE - Quick startup guide
├── start_darts.sh             # Start darts-caller server
├── DeadEyeGames/              # 🎮 Main web-based gaming platform
│   ├── START_HERE.md          # Navigation guide
│   ├── run_games.sh           # Start the games server
│   ├── server.py              # Flask server
│   └── games/                 # Individual game folders
│       ├── zombie-slayer/
│       └── heist-crew/
├── DeadEyeDarts/              # 🧟 Legacy Python CLI game
│   └── deadeyedarts_client.py
├── darts-caller/              # Third-party autodarts connector
└── _archive/                  # Old documentation (archived)
```

## Features

- ✅ Real-time dart tracking with autodarts.io
- ✅ Retro 90's cyberpunk aesthetic
- ✅ Multiple game modes (solo and multiplayer)
- ✅ Web-based interface - play in your browser
- ✅ Modular architecture - easy to add new games

## Requirements

- Python 3.7+
- autodarts.io account (with 2FA disabled)
- autodarts board OR manual entry at play.autodarts.io
- Modern web browser (Chrome, Firefox, Safari, Edge)
- **darts-caller** (clone separately): `git clone https://github.com/lbormann/darts-caller.git`

## How It Works

1. **darts-caller** connects to autodarts.io and broadcasts dart events
2. **DeadEyeGames server** listens to these events via Socket.IO
3. **Web browser** connects to the game server
4. Each dart throw is processed in real-time and displayed in the browser

## Current Games

### Zombie Slayer 🧟
- Kill zombies by hitting their assigned numbers
- Miss 3 times = game over
- Bonus points for doubles and triples

### HEIST CREW 🎯
- 3-player cooperative heist missions
- Choose your role: Hacker, Infiltrator, or Demolitions
- Complete 5 story-driven missions
- Time pressure and alert level mechanics

## Documentation

- **Quick Start:** [HOWTOSTART.md](HOWTOSTART.md) - Get playing in 2 commands
- **DeadEyeGames:** [DeadEyeGames/START_HERE.md](DeadEyeGames/START_HERE.md) - Full game platform docs
- **Archived Docs:** [_archive/](_archive/) - Legacy setup guides

## Credits

- **darts-caller** by lbormann: https://github.com/lbormann/darts-caller
- **autodarts.io**: https://autodarts.io
- Built with Flask, Socket.IO, and vanilla JavaScript

---

Made with ❤️ for dart gaming! 🎯✨
