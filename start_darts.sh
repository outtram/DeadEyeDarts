#!/bin/bash

# Darts Caller - Foolproof Startup Script
# This script handles everything automatically!

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "=========================================="
echo "     DARTS CALLER - AUTO SETUP"
echo "=========================================="
echo -e "${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

VENV_DIR="$SCRIPT_DIR/darts-venv"
REQUIREMENTS_FILE="$SCRIPT_DIR/darts-caller/requirements.txt"

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

# Check if dependencies need to be installed/updated
NEEDS_INSTALL=false

if [ ! -f "$VENV_DIR/.dependencies_installed" ]; then
    NEEDS_INSTALL=true
    echo -e "${YELLOW}→${NC} First time setup - installing dependencies..."
elif [ "$REQUIREMENTS_FILE" -nt "$VENV_DIR/.dependencies_installed" ]; then
    NEEDS_INSTALL=true
    echo -e "${YELLOW}→${NC} Requirements updated - reinstalling dependencies..."
fi

if [ "$NEEDS_INSTALL" = true ]; then
    echo -e "${YELLOW}→${NC} Installing Python packages (this may take a few minutes)..."

    # Upgrade pip first
    pip install --upgrade pip --quiet

    # Install requirements with updated versions for compatibility
    pip install --upgrade \
        pyinstaller \
        python-keycloak \
        websocket-client \
        the-mask \
        Flask \
        Flask-SocketIO \
        certifi \
        Werkzeug \
        pygame \
        download \
        psutil \
        cryptography \
        python-dotenv \
        --quiet

    # Mark dependencies as installed
    touch "$VENV_DIR/.dependencies_installed"
    echo -e "${GREEN}✓${NC} All dependencies installed successfully!"
else
    echo -e "${GREEN}✓${NC} Dependencies up to date"
fi

# Check if darts-caller directory exists
if [ ! -d "$SCRIPT_DIR/darts-caller" ]; then
    echo -e "${RED}ERROR: darts-caller directory not found!${NC}"
    echo "Please make sure this script is in the same directory as the 'darts-caller' folder."
    exit 1
fi

# Check if darts-media directory exists, create if not
if [ ! -d "$SCRIPT_DIR/darts-media" ]; then
    echo -e "${YELLOW}→${NC} Creating darts-media directory..."
    mkdir -p "$SCRIPT_DIR/darts-media"
fi

echo ""
echo -e "${BLUE}=========================================="
echo "     STARTING DARTS CALLER"
echo "=========================================="
echo -e "${NC}"
echo ""

# Run the application
cd "$SCRIPT_DIR/darts-caller"
python3 darts-caller.py \
  -U "troy@outtram.com" \
  -P 'Surf2Work!977' \
  -B "9ee38305-e258-4e20-af39-f66fb477de46" \
  -M "$SCRIPT_DIR/darts-media"
