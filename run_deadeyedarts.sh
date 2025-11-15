#!/bin/bash

# DeadEyeDarts - Startup Script with Virtual Environment
# This ensures we use the correct Python packages every time!

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "=========================================="
echo "     DEADEYEDARTS - AUTO SETUP"
echo "=========================================="
echo -e "${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

VENV_DIR="$SCRIPT_DIR/deadeyedarts-venv"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}ERROR: Python 3 is not installed!${NC}"
    echo "Please install Python 3 from https://www.python.org/"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo -e "${GREEN}✓${NC} Found $PYTHON_VERSION"

# Check if virtual environment exists
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}→${NC} Creating virtual environment (first time setup)..."
    python3 -m venv "$VENV_DIR"
    echo -e "${GREEN}✓${NC} Virtual environment created!"
else
    echo -e "${GREEN}✓${NC} Virtual environment found"
fi

# Activate virtual environment
echo -e "${YELLOW}→${NC} Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Check if dependencies are installed
if [ ! -f "$VENV_DIR/.dependencies_installed" ]; then
    echo -e "${YELLOW}→${NC} First time setup - installing dependencies..."

    # Upgrade pip first
    pip install --upgrade pip --quiet

    # Install required packages
    pip install --upgrade \
        python-socketio \
        urllib3 \
        --quiet

    # Mark dependencies as installed
    touch "$VENV_DIR/.dependencies_installed"
    echo -e "${GREEN}✓${NC} All dependencies installed successfully!"
else
    echo -e "${GREEN}✓${NC} Dependencies up to date"
fi

echo ""
echo -e "${BLUE}=========================================="
echo "     STARTING DEADEYEDARTS"
echo "=========================================="
echo -e "${NC}"
echo ""

# Run the application
cd "$SCRIPT_DIR/DeadEyeDarts"
python3 deadeyedarts_client.py
