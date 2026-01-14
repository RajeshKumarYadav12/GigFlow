#!/bin/bash

echo "================================"
echo " GigFlow Setup Script"
echo "================================"
echo ""

echo "[1/4] Setting up Backend..."
cd backend
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
else
    echo ".env file already exists, skipping..."
fi
echo "Installing backend dependencies..."
npm install
echo ""

echo "[2/4] Setting up Frontend..."
cd ../frontend
echo "Installing frontend dependencies..."
npm install
echo ""

echo "[3/4] Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "MongoDB is installed!"
else
    echo "WARNING: MongoDB not found! Please install MongoDB."
    echo "Download from: https://www.mongodb.com/try/download/community"
fi
echo ""

echo "[4/4] Setup Complete!"
echo ""
echo "================================"
echo " Next Steps:"
echo "================================"
echo "1. Edit backend/.env file if needed"
echo "2. Start MongoDB service"
echo "3. Open TWO terminal windows:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173"
echo "================================"
echo ""
