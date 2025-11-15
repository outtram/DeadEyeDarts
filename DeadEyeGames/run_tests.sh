#!/bin/bash
# Run Playwright browser tests for DeadEyeGames

echo "🎯 DeadEyeGames - Browser Test Runner"
echo "====================================="
echo ""

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Virtual environment not activated. Activating..."
    source venv/bin/activate
fi

# Check if server is running
if ! lsof -i :5001 | grep -q LISTEN; then
    echo "❌ ERROR: DeadEyeGames server is not running on port 5001"
    echo ""
    echo "Please start the server first:"
    echo "  ./run_games.sh"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✓ Server is running on port 5001"
echo ""

# Parse command line arguments
ARGS="$@"

# If no arguments provided, run all tests
if [ -z "$ARGS" ]; then
    echo "Running all tests..."
    pytest tests/ -v
else
    echo "Running tests with arguments: $ARGS"
    pytest tests/ $ARGS
fi
