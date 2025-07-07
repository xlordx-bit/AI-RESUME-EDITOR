#!/bin/bash

# SkillSync Startup Script
echo "🚀 Starting SkillSync Application..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.10 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js."
    exit 1
fi

# Navigate to the server directory and check/install Python dependencies
echo "📦 Checking Python dependencies..."
cd "../server"

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found in server directory"
    exit 1
fi

# Install Python dependencies if needed
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Navigate back to frontend directory
cd "../SkillSync"

# Install Node.js dependencies if needed
echo "📥 Installing Node.js dependencies..."
npm install

# Start both backend and frontend
echo "🎯 Starting both backend and frontend..."
npm run dev
