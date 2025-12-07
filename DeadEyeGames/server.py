#!/usr/bin/env python3
"""
DeadEyeGames Server - Flask web server that bridges autodarts.io to web games
Connects to autodarts.io WebSocket and forwards dart events to browser clients
"""
from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit
import socketio
import json
import threading
import logging
import os
import websocket

# Flask app configuration
app = Flask(__name__)
app.config['SECRET_KEY'] = 'deadeye-games-secret'

# Socket.IO for browser clients
web_socketio = SocketIO(app, cors_allowed_origins="*")

# Socket.IO client for darts-caller connection
# Use engineio_version=4 to match darts-caller's Socket.IO v4 protocol
darts_client = socketio.Client(ssl_verify=False, engineio_logger=False)  # Disable SSL verification for self-signed cert

# Connection status
darts_connected = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# =============================================================================
# DARTS-CALLER WEBSOCKET CLIENT
# =============================================================================

@darts_client.event
def connect():
    """Called when successfully connected to darts-caller"""
    global darts_connected
    darts_connected = True
    logger.info("✓ Connected to darts-caller at https://localhost:8079")

    # Try sending a message to darts-caller to register/subscribe
    logger.info("Attempting to subscribe to dart events...")
    darts_client.emit('message', {'event': 'subscribe', 'client': 'DeadEyeGames'})

    # Notify all web clients about connection status
    web_socketio.emit('darts_status', {'connected': True})


@darts_client.event
def disconnect():
    """Called when disconnected from darts-caller"""
    global darts_connected
    darts_connected = False
    logger.info("✗ Disconnected from darts-caller")
    # Notify all web clients about disconnection
    web_socketio.emit('darts_status', {'connected': False})


@darts_client.event
def connect_error(data):
    """Called when connection to darts-caller fails"""
    logger.error(f"Connection error: {data}")
    logger.error("Make sure darts-caller is running at https://localhost:8079")


@darts_client.on('message')
def on_darts_message(data):
    """
    Handle messages from darts-caller
    Listens for dart throw events and forwards to web clients
    """
    try:
        # Log ALL messages received
        logger.info(f"RAW MESSAGE RECEIVED: {data}")

        # Parse message data
        event_data = json.loads(data) if isinstance(data, str) else data
        event_type = event_data.get('event', 'UNKNOWN')

        logger.info(f"EVENT TYPE: {event_type}")

        # Filter for dart throw events
        if event_type in ['dart1-thrown', 'dart2-thrown', 'dart3-thrown']:
            # Log the full message for debugging
            logger.info(f"Full dart message: {json.dumps(event_data, indent=2)}")

            # Extract dart information from game object
            game = event_data.get('game', {})
            segment = game.get('fieldNumber', 0)      # Dartboard number (1-20, or 0 for bullseye)
            multiplier = game.get('fieldMultiplier', 1)  # 1=single, 2=double, 3=triple
            value = game.get('dartValue', 0)          # Point value
            dart_number = game.get('dartNumber', '?')  # Which dart in the round
            player = event_data.get('player', 'Unknown')

            # Create dart throw object for web clients
            dart_throw = {
                'event': event_type,
                'segment': segment,
                'multiplier': multiplier,
                'value': value,
                'dartNumber': dart_number,
                'player': player
            }

            logger.info(f"Dart throw from {player}: {segment} x{multiplier} = {value} points")

            # Broadcast to all connected web clients
            web_socketio.emit('dart_thrown', dart_throw)

    except Exception as e:
        logger.error(f"Error processing dart message: {e}")
        import traceback
        logger.error(traceback.format_exc())


def connect_to_darts_caller():
    """
    Connect to darts-caller WebSocket in a separate thread
    This runs independently from the Flask web server
    """
    import time
    max_retries = 5
    retry_delay = 2

    for attempt in range(max_retries):
        try:
            logger.info(f"Connecting to darts-caller at https://127.0.0.1:8079... (attempt {attempt + 1}/{max_retries})")
            darts_client.connect(
                "https://127.0.0.1:8079",
                transports=['websocket', 'polling'],
                wait_timeout=10
            )
            darts_client.wait()  # Keep connection alive
            break
        except Exception as e:
            logger.error(f"Connection attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                logger.error("Failed to connect to darts-caller after multiple attempts!")
                logger.error("Make sure darts-caller is running at https://127.0.0.1:8079")


# =============================================================================
# WEB ROUTES
# =============================================================================

@app.route('/')
def homepage():
    """Serve the main homepage with game selection"""
    return render_template('homepage.html')


@app.route('/games/zombie-slayer')
def zombie_game():
    """Serve the Zombie Slayer game page"""
    return send_from_directory('games/zombie-slayer', 'zombie.html')


@app.route('/static/css/<path:filename>')
def serve_css(filename):
    """Serve CSS files from static/css directory"""
    return send_from_directory('static/css', filename)


@app.route('/static/js/<path:filename>')
def serve_js(filename):
    """Serve JavaScript files from static/js directory"""
    return send_from_directory('static/js', filename)


@app.route('/games/zombie-slayer/<path:filename>')
def serve_zombie_assets(filename):
    """Serve game-specific assets from zombie-slayer directory"""
    return send_from_directory('games/zombie-slayer', filename)


@app.route('/games/heist-crew')
def heist_game():
    """Serve the Heist Crew game page"""
    return send_from_directory('games/heist-crew', 'heist.html')


@app.route('/games/heist-crew/<path:filename>')
def serve_heist_assets(filename):
    """Serve game-specific assets from heist-crew directory"""
    return send_from_directory('games/heist-crew', filename)


@app.route('/games/dad-bod-olympics')
def dad_bod_game():
    """Serve the Dad Bod Olympics game page"""
    return send_from_directory('games/dad-bod-olympics', 'dad-bod.html')


@app.route('/games/dad-bod-olympics/<path:filename>')
def serve_dad_bod_assets(filename):
    """Serve game-specific assets from dad-bod-olympics directory"""
    return send_from_directory('games/dad-bod-olympics', filename)


@app.route('/games/dungeon-crawl')
def dungeon_game():
    """Serve the Dungeon of Darts game page"""
    return send_from_directory('games/dungeon-crawl', 'dungeon.html')


@app.route('/games/dungeon-crawl/<path:filename>')
def serve_dungeon_assets(filename):
    """Serve game-specific assets from dungeon-crawl directory"""
    return send_from_directory('games/dungeon-crawl', filename)


@app.route('/games/station-siege')
def station_siege_game():
    """Serve the Station Siege game page"""
    return send_from_directory('games/station-siege', 'station-siege.html')


@app.route('/games/station-siege/<path:filename>')
def serve_station_siege_assets(filename):
    """Serve game-specific assets from station-siege directory"""
    return send_from_directory('games/station-siege', filename)


# =============================================================================
# WEB SOCKET EVENTS (Browser to Server)
# =============================================================================

@web_socketio.on('connect')
def handle_web_connect():
    """Handle new browser client connection"""
    logger.info("Web client connected")
    # Send current darts-caller connection status
    emit('darts_status', {'connected': darts_connected})


@web_socketio.on('disconnect')
def handle_web_disconnect():
    """Handle browser client disconnection"""
    logger.info("Web client disconnected")


@web_socketio.on('ping')
def handle_ping():
    """Respond to ping from web clients (keep-alive)"""
    emit('pong', {'connected': darts_connected})


# =============================================================================
# SERVER STARTUP
# =============================================================================

def print_banner():
    """Display startup banner"""
    banner = """
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ██████╗ ███████╗ █████╗ ██████╗     ███████╗██╗   ██╗███████╗      ║
║   ██╔══██╗██╔════╝██╔══██╗██╔══██╗    ██╔════╝╚██╗ ██╔╝██╔════╝      ║
║   ██║  ██║█████╗  ███████║██║  ██║    █████╗   ╚████╔╝ █████╗        ║
║   ██║  ██║██╔══╝  ██╔══██║██║  ██║    ██╔══╝    ╚██╔╝  ██╔══╝        ║
║   ██████╔╝███████╗██║  ██║██████╔╝    ███████╗   ██║   ███████╗      ║
║   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝     ╚══════╝   ╚═╝   ╚══════╝      ║
║                                                                      ║
║    ██████╗  █████╗ ███╗   ███╗███████╗███████╗                       ║
║   ██╔════╝ ██╔══██╗████╗ ████║██╔════╝██╔════╝                       ║
║   ██║  ███╗███████║██╔████╔██║█████╗  ███████╗                       ║
║   ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  ╚════██║                       ║
║   ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗███████║                       ║
║    ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝                       ║
║                                                                      ║
║              RETRO CYBERPUNK DART GAMING PLATFORM                    ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝

    Server: http://localhost:5001
    Darts-Caller: https://localhost:8079

    Starting services...
"""
    print(banner)


if __name__ == '__main__':
    print_banner()

    # Start darts-caller connection in separate thread
    darts_thread = threading.Thread(target=connect_to_darts_caller, daemon=True)
    darts_thread.start()

    # Start Flask web server
    logger.info("Starting web server on http://localhost:5001")
    logger.info("Open your browser to http://localhost:5001 to play!")

    # Run Flask app with Socket.IO
    web_socketio.run(app, host='0.0.0.0', port=5001, debug=False, allow_unsafe_werkzeug=True)
