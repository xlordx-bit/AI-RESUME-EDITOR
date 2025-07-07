@echo off
echo 🚀 Starting SkillSync Application...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.10 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js.
    pause
    exit /b 1
)

REM Navigate to the server directory and check/install Python dependencies
echo 📦 Checking Python dependencies...
cd "..\server"

REM Check if requirements.txt exists
if not exist "requirements.txt" (
    echo ❌ requirements.txt not found in server directory
    pause
    exit /b 1
)

REM Install Python dependencies if needed
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Navigate back to frontend directory
cd "..\SkillSync"

REM Install Node.js dependencies if needed
echo 📥 Installing Node.js dependencies...
npm install

REM Start both backend and frontend
echo 🎯 Starting both backend and frontend...
npm run dev

pause
