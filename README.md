# 🎯 DeadEyeDarts

A zombie-themed darts game that connects to your autodarts.io board for real-time dart tracking!

## What is this?

DeadEyeDarts is a custom game client that listens to your autodarts.io dartboard and displays individual dart throws with zombie hit detection. Hit numbers 11-20 to defeat zombies, with bonus damage for doubles and triples!

## Quick Start

### First Time Setup
Read **[SETUP_FIRST_TIME.md](SETUP_FIRST_TIME.md)** for detailed installation instructions.

### Daily Use
Read **[QUICK_START.md](QUICK_START.md)** for quick startup instructions.

## Project Structure

```
CODE/
├── DeadEyeDarts/              # YOUR zombie darts game!
│   └── deadeyedarts_client.py # Main game logic
├── darts-caller/              # Third-party autodarts connector
├── start_darts.sh             # Start darts-caller server
├── run_deadeyedarts.sh        # Start YOUR game
├── SETUP_FIRST_TIME.md        # First-time setup guide
└── QUICK_START.md             # Daily usage guide
```

## Features

- ✅ Real-time individual dart tracking
- ✅ Works with X01 games (501, 301, etc.)
- ✅ Zombie target detection (numbers 11-20)
- ✅ Bonus damage for doubles and triples
- ✅ Easy to extend with your own game logic

## Requirements

- Python 3.x
- autodarts.io account (with 2FA disabled)
- autodarts board OR manual entry at play.autodarts.io
- **darts-caller** (clone separately): `git clone https://github.com/lbormann/darts-caller.git`

## How It Works

1. **darts-caller** connects to autodarts.io and broadcasts dart events
2. **DeadEyeDarts** listens to these events via Socket.IO
3. Each dart throw is processed and displayed with zombie game logic

## Game Rules (Current)

- **Zombie Targets:** Numbers 11-20
- **Single hit:** Normal damage 💀
- **Double hit:** Extra damage ⚡⚡
- **Triple hit:** BONUS damage ⚡⚡⚡
- **Miss:** Any number outside 11-20

## Customization

Edit `DeadEyeDarts/deadeyedarts_client.py` to customize:
- Zombie target numbers
- Damage calculations
- Game logic and scoring
- Visual output

## Credits

- **darts-caller** by lbormann: https://github.com/lbormann/darts-caller
- **autodarts.io**: https://autodarts.io

## License

DeadEyeDarts game client: Your code, your rules!

darts-caller: See darts-caller/README.md for license info

---

Made with ❤️ for zombie dart slaying! 🧟‍♂️🎯
