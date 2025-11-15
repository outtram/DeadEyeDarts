#!/usr/bin/env python3
"""
DeadEyeDarts Client - Connects to darts-caller and displays dart throws
"""
import socketio
import json
import sys
from datetime import datetime

# Create Socket.IO client (disable SSL verification for self-signed cert)
sio = socketio.Client(ssl_verify=False)

@sio.event
def connect():
    print("=" * 70)
    print("🎯 DeadEyeDarts Connected to darts-caller!")
    print("=" * 70)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\nWaiting for dart throws...")
    print("Go to https://play.autodarts.io/ and manually enter darts!")
    print("Or throw physical darts at your board!")
    print("=" * 70)

@sio.event
def disconnect():
    print("\n🔌 Disconnected from darts-caller")

@sio.event
def connect_error(data):
    print(f"\n❌ Connection Error: {data}")
    print("Make sure darts-caller is running in the other terminal!")

@sio.on('message')
def on_message(data):
    try:
        event_data = json.loads(data) if isinstance(data, str) else data
        event_type = event_data.get('event', 'UNKNOWN')

        # Listen for individual dart throws from X01/Shanghai/Gotcha modes
        if event_type in ['dart1-thrown', 'dart2-thrown', 'dart3-thrown']:
            # Parse dart throw from the game object
            game = event_data.get('game', {})
            segment = game.get('fieldNumber', 0)
            multiplier = game.get('fieldMultiplier', 1)
            value = game.get('dartValue', 0)
            dart_number = game.get('dartNumber', '?')
            player = event_data.get('player', 'Unknown')

            mult_name = {1: 'Single', 2: 'Double', 3: 'Triple'}.get(multiplier, '')

            print("\n🎯 " + "═" * 60)
            print(f"   DART #{dart_number} - {player}")
            print(f"   HIT: {segment} ({mult_name}) = {value} points")
            print("   " + "═" * 60)

            # Example zombie game logic
            zombie_targets = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11]
            if segment in zombie_targets:
                print(f"\n   💀 ZOMBIE HIT! Number {segment}")
                if multiplier == 3:
                    print(f"   ⚡ TRIPLE! BONUS DAMAGE!")
                elif multiplier == 2:
                    print(f"   ⚡ DOUBLE! EXTRA DAMAGE!")
            else:
                print(f"\n   ❌ Miss! Zombie not at {segment}")

    except Exception as e:
        print(f"Error: {e}")

def main():
    print("\n🎯 DeadEyeDarts Client Starting...")
    print("Connecting to darts-caller at https://localhost:8079\n")

    try:
        sio.connect("https://localhost:8079")
        sio.wait()
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down...")
        sio.disconnect()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure darts-caller is running!")
        sys.exit(1)

if __name__ == "__main__":
    main()
