@echo off
echo ================================
echo  GigFlow Setup Script
echo ================================
echo.

echo [1/4] Setting up Backend...
cd backend
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
) else (
    echo .env file already exists, skipping...
)
echo Installing backend dependencies...
call npm install
echo.

echo [2/4] Setting up Frontend...
cd ..\frontend
echo Installing frontend dependencies...
call npm install
echo.

echo [3/4] Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB not found! Please install MongoDB.
    echo Download from: https://www.mongodb.com/try/download/community
) else (
    echo MongoDB is installed!
)
echo.

echo [4/4] Setup Complete!
echo.
echo ================================
echo  Next Steps:
echo ================================
echo 1. Edit backend\.env file if needed
echo 2. Start MongoDB service
echo 3. Open TWO terminal windows:
echo.
echo    Terminal 1 (Backend):
echo    cd backend
echo    npm run dev
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open http://localhost:5173
echo ================================
echo.
pause
