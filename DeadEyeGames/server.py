#!/usr/bin/env python3
"""
DeadEyeGames Server - Flask web server that bridges darts-caller to web games
Connects to darts-caller WebSocket and forwards dart events to browser clients
"""
from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit
import socketio
import json
import threading
import logging
import os

# Flask app configuration
app = Flask(__name__)
app.config['SECRET_KEY'] = 'deadeye-games-secret'

# Socket.IO for browser clients
web_socketio = SocketIO(app, cors_allowed_origins="*")

# Socket.IO client for darts-caller connection
darts_client = socketio.Client(ssl_verify=False)  # Disable SSL verification for self-signed cert

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
        # Parse message data
        event_data = json.loads(data) if isinstance(data, str) else data
        event_type = event_data.get('event', 'UNKNOWN')

        # Filter for dart throw events
        if event_type in ['dart1-thrown', 'dart2-thrown', 'dart3-thrown']:
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

            logger.info(f"Dart throw: {segment} x{multiplier} = {value} points")

            # Broadcast to all connected web clients
            web_socketio.emit('dart_thrown', dart_throw)

    except Exception as e:
        logger.error(f"Error processing dart message: {e}")


def connect_to_darts_caller():
    """
    Connect to darts-caller WebSocket in a separate thread
    This runs independently from the Flask web server
    """
    try:
        logger.info("Connecting to darts-caller at https://localhost:8079...")
        darts_client.connect("https://localhost:8079")
        darts_client.wait()  # Keep connection alive
    except Exception as e:
        logger.error(f"Failed to connect to darts-caller: {e}")
        logger.error("Make sure darts-caller is running!")


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
    web_socketio.run(app, host='0.0.0.0', port=5001, debug=False)
