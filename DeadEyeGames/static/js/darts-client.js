/**
 * DeadEyeGames - Darts Client WebSocket Handler
 *
 * This module handles the WebSocket connection between the browser and the Flask server.
 * The Flask server forwards dart throw events from darts-caller to all connected clients.
 *
 * Usage:
 * 1. Include this script in your HTML page
 * 2. Call DartsClient.init() with your event handlers
 * 3. Listen for dart throw events via the onDartThrown callback
 *
 * Example:
 *   DartsClient.init({
 *     onConnected: () => console.log('Connected'),
 *     onDartThrown: (dart) => console.log('Dart thrown:', dart),
 *     onDisconnected: () => console.log('Disconnected')
 *   });
 */

const DartsClient = (function() {
    // Private variables
    let socket = null;
    let isConnected = false;
    let dartsCallerConnected = false;
    let handlers = {};

    /**
     * Initialize the darts client connection
     * @param {Object} options - Configuration options
     * @param {Function} options.onConnected - Called when connected to server
     * @param {Function} options.onDisconnected - Called when disconnected from server
     * @param {Function} options.onDartsStatus - Called when darts-caller status changes
     * @param {Function} options.onDartThrown - Called when dart is thrown
     */
    function init(options = {}) {
        handlers = options;

        // Initialize Socket.IO connection to Flask server
        console.log('DartsClient: Initializing connection...');
        socket = io();

        // Connection established
        socket.on('connect', () => {
            console.log('DartsClient: Connected to server');
            isConnected = true;

            if (handlers.onConnected) {
                handlers.onConnected();
            }

            updateConnectionStatus(true, dartsCallerConnected);
        });

        // Connection lost
        socket.on('disconnect', () => {
            console.log('DartsClient: Disconnected from server');
            isConnected = false;
            dartsCallerConnected = false;

            if (handlers.onDisconnected) {
                handlers.onDisconnected();
            }

            updateConnectionStatus(false, false);
        });

        // Darts-caller connection status update
        socket.on('darts_status', (data) => {
            console.log('DartsClient: Darts-caller status:', data.connected);
            dartsCallerConnected = data.connected;

            if (handlers.onDartsStatus) {
                handlers.onDartsStatus(data.connected);
            }

            updateConnectionStatus(isConnected, dartsCallerConnected);
        });

        // Dart thrown event from darts-caller
        socket.on('dart_thrown', (dart) => {
            console.log('DartsClient: Dart thrown:', dart);

            if (handlers.onDartThrown) {
                handlers.onDartThrown(dart);
            }
        });

        // Pong response (for keep-alive)
        socket.on('pong', (data) => {
            dartsCallerConnected = data.connected;
            updateConnectionStatus(isConnected, dartsCallerConnected);
        });

        // Start keep-alive ping
        startKeepAlive();
    }

    /**
     * Send keep-alive ping to server
     */
    function startKeepAlive() {
        setInterval(() => {
            if (socket && isConnected) {
                socket.emit('ping');
            }
        }, 5000); // Ping every 5 seconds
    }

    /**
     * Update connection status indicators in the UI
     * @param {boolean} serverConnected - Whether connected to Flask server
     * @param {boolean} dartsConnected - Whether darts-caller is connected
     */
    function updateConnectionStatus(serverConnected, dartsConnected) {
        // Update status indicator if it exists on the page
        const statusIndicator = document.getElementById('connection-status');
        if (statusIndicator) {
            const statusDot = statusIndicator.querySelector('.status-dot');
            const statusText = statusIndicator.querySelector('.status-text');

            if (serverConnected && dartsConnected) {
                statusIndicator.className = 'status-indicator connected';
                if (statusText) statusText.textContent = 'Connected';
            } else if (serverConnected && !dartsConnected) {
                statusIndicator.className = 'status-indicator disconnected';
                if (statusText) statusText.textContent = 'Darts-Caller Offline';
            } else {
                statusIndicator.className = 'status-indicator disconnected';
                if (statusText) statusText.textContent = 'Disconnected';
            }
        }
    }

    /**
     * Get current connection status
     * @returns {Object} Connection status
     */
    function getStatus() {
        return {
            serverConnected: isConnected,
            dartsCallerConnected: dartsCallerConnected
        };
    }

    /**
     * Disconnect from server
     */
    function disconnect() {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    }

    // Public API
    return {
        init: init,
        getStatus: getStatus,
        disconnect: disconnect
    };
})();

// Auto-initialize if connection status element exists
document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
        console.log('DartsClient: Auto-initializing...');
        DartsClient.init({
            onConnected: () => {
                console.log('Connected to DeadEyeGames server');
            },
            onDisconnected: () => {
                console.log('Disconnected from DeadEyeGames server');
            },
            onDartsStatus: (connected) => {
                console.log('Darts-caller status:', connected ? 'Connected' : 'Disconnected');
            }
        });
    }
});
