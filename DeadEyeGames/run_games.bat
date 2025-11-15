@echo off
REM DeadEyeGames Startup Script for Windows
REM This script sets up the virtual environment and starts the game server

title DeadEyeGames - Retro Cyberpunk Dart Gaming Platform

REM Display ASCII Art Banner
echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║   ██████╗ ███████╗ █████╗ ██████╗     ███████╗██╗   ██╗███████╗   ║
echo ║   ██╔══██╗██╔════╝██╔══██╗██╔══██╗    ██╔════╝╚██╗ ██╔╝██╔════╝   ║
echo ║   ██║  ██║█████╗  ███████║██║  ██║    █████╗   ╚████╔╝ █████╗     ║
echo ║   ██║  ██║██╔══╝  ██╔══██║██║  ██║    ██╔══╝    ╚██╔╝  ██╔══╝     ║
echo ║   ██████╔╝███████╗██║  ██║██████╔╝    ███████╗   ██║   ███████╗   ║
echo ║   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝     ╚══════╝   ╚═╝   ╚══════╝   ║
echo ║                                                                      ║
echo ║    ██████╗  █████╗ ███╗   ███╗███████╗███████╗                     ║
echo ║   ██╔════╝ ██╔══██╗████╗ ████║██╔════╝██╔════╝                     ║
echo ║   ██║  ███╗███████║██╔████╔██║█████╗  ███████╗                     ║
echo ║   ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  ╚════██║                     ║
echo ║   ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗███████║                     ║
echo ║    ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝                     ║
echo ║                                                                      ║
echo ║              RETRO CYBERPUNK DART GAMING PLATFORM                   ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.
echo Initializing DeadEyeGames...
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python 3 and try again.
    pause
    exit /b 1
)

echo [✓] Python found:
python --version
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo [✓] Virtual environment created
) else (
    echo [✓] Virtual environment found
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment!
    pause
    exit /b 1
)
echo [✓] Virtual environment activated
echo.

REM Install/upgrade dependencies
echo Installing dependencies...
python -m pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt >nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo [✓] Dependencies installed
echo.

REM Check if darts-caller is running
echo Checking darts-caller connection...
curl -k https://localhost:8079 >nul 2>&1
if errorlevel 1 (
    echo [⚠] darts-caller not detected at https://localhost:8079
    echo     Make sure darts-caller is running before throwing darts!
) else (
    echo [✓] darts-caller is running at https://localhost:8079
)
echo.

REM Start the server
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  Starting DeadEyeGames server...                              ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Server starting at: http://localhost:5001
echo Darts-caller: https://localhost:8079
echo.
echo Opening browser...

REM Wait a moment then open browser
timeout /t 2 /nobreak >nul
start http://localhost:5001

REM Start the Flask server
python server.py

REM Cleanup message when server stops
echo.
echo Server stopped.
echo Thanks for playing DeadEyeGames!
echo.
pause
