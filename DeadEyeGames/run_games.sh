#!/bin/bash
# DeadEyeGames Startup Script for Mac/Linux
# This script sets up the virtual environment and starts the game server

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# ASCII Art Banner
echo -e "${MAGENTA}"
cat << "EOF"
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
EOF
echo -e "${NC}"

echo -e "${CYAN}Initializing DeadEyeGames...${NC}\n"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}ERROR: Python 3 is not installed!${NC}"
    echo "Please install Python 3 and try again."
    exit 1
fi

echo -e "${GREEN}✓${NC} Python 3 found: $(python3 --version)"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: Failed to create virtual environment!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} Virtual environment created"
else
    echo -e "${GREEN}✓${NC} Virtual environment found"
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to activate virtual environment!${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Virtual environment activated"

# Install/upgrade dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to install dependencies!${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Dependencies installed"

# Check if darts-caller is running
echo -e "\n${YELLOW}Checking darts-caller connection...${NC}"
if curl -k https://localhost:8079 &> /dev/null; then
    echo -e "${GREEN}✓${NC} darts-caller is running at https://localhost:8079"
else
    echo -e "${YELLOW}⚠${NC}  darts-caller not detected at https://localhost:8079"
    echo -e "   Make sure darts-caller is running before throwing darts!"
fi

# Start the server
echo -e "\n${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  Starting DeadEyeGames server...                              ${CYAN}║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}Server starting at: ${CYAN}http://localhost:5001${NC}"
echo -e "${GREEN}Darts-caller: ${CYAN}https://localhost:8079${NC}\n"

# Wait a moment for server to start, then open browser
sleep 2 && open http://localhost:5001 &

# Start the Flask server
python3 server.py

# Cleanup message when server stops
echo -e "\n${YELLOW}Server stopped.${NC}"
echo -e "${CYAN}Thanks for playing DeadEyeGames!${NC}\n"
