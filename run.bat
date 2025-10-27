@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         🚀 PaperPress CMS - One-Click Launcher 🚀         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM ============================================
REM Check Node.js Installation
REM ============================================
echo [1/7] Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ❌ ERROR: Node.js is NOT installed!
    echo.
    echo Please download and install Node.js from:
    echo 👉 https://nodejs.org/
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    ✅ Node.js %NODE_VERSION% detected
timeout /t 1 /nobreak >nul

REM ============================================
REM Check/Create Environment Files
REM ============================================
echo.
echo [2/7] Setting up environment configuration...
if not exist "server\.env" (
    echo    📝 Creating server/.env file...
    (
        echo PORT=4000
        echo MONGO_URI=mongodb://localhost:27017/paperpress
        echo JWT_SECRET=paperpress-secret-key-2025
        echo JWT_EXPIRE=7d
        echo CORS_ORIGIN=http://localhost:5173
        echo NODE_ENV=development
        echo MAX_FILE_SIZE=5242880
    ) > server\.env
    echo    ✅ server/.env created
) else (
    echo    ✅ server/.env already exists
)

if not exist "client\.env" (
    echo    📝 Creating client/.env file...
    echo VITE_API_URL=http://localhost:4000/api > client\.env
    echo    ✅ client/.env created
) else (
    echo    ✅ client/.env already exists
)
timeout /t 1 /nobreak >nul

REM ============================================
REM Install Dependencies
REM ============================================
echo.
echo [3/7] Installing dependencies...
if not exist "server\node_modules" (
    echo    📦 Installing server dependencies... (This may take a while)
    cd server
    call npm install --silent >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo    ⚠️  Silent install failed, trying verbose install...
        call npm install
    )
    cd ..
    echo    ✅ Server dependencies installed
) else (
    echo    ✅ Server dependencies already installed
)

if not exist "client\node_modules" (
    echo    📦 Installing client dependencies... (This may take a while)
    cd client
    call npm install --silent >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo    ⚠️  Silent install failed, trying verbose install...
        call npm install
    )
    cd ..
    echo    ✅ Client dependencies installed
) else (
    echo    ✅ Client dependencies already installed
)
timeout /t 1 /nobreak >nul

REM ============================================
REM Start MongoDB
REM ============================================
echo.
echo [4/7] Starting MongoDB...
if exist "docker-compose.yml" (
    where docker >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo    🐳 Starting MongoDB with Docker Compose...
        docker-compose up -d mongodb >nul 2>nul
        if %ERRORLEVEL% EQU 0 (
            echo    ✅ MongoDB started successfully
            timeout /t 3 /nobreak >nul
        ) else (
            echo    ⚠️  Docker Compose failed, MongoDB might already be running
        )
    ) else (
        echo    ⚠️  Docker not found - please ensure MongoDB is running manually
        echo    💡 You can install MongoDB from: https://www.mongodb.com/try/download/community
    )
) else (
    echo    ⚠️  docker-compose.yml not found
    echo    💡 Please ensure MongoDB is running on mongodb://localhost:27017
)
timeout /t 1 /nobreak >nul

REM ============================================
REM Check if database needs seeding
REM ============================================
echo.
echo [5/7] Checking database...
set DB_SEEDED=0
if exist "server\.db_seeded" (
    set DB_SEEDED=1
    echo    ✅ Database already seeded
) else (
    echo    📊 Database not seeded yet
    set /p SEED_NOW="    Do you want to seed the database with sample data? (Y/N): "
    if /i "!SEED_NOW!"=="Y" (
        echo    🌱 Seeding database...
        cd server
        call npm run seed
        if %ERRORLEVEL% EQU 0 (
            echo. > .db_seeded
            echo    ✅ Database seeded successfully!
        ) else (
            echo    ⚠️  Database seeding failed
        )
        cd ..
    ) else (
        echo    ⏭️  Skipped database seeding
    )
)
timeout /t 1 /nobreak >nul

REM ============================================
REM Start Services
REM ============================================
echo.
echo [6/7] Starting application services...
echo    🔧 Starting Backend Server (port 4000)...
start "PaperPress - Backend Server" cmd /k "cd /d %CD%\server && echo ╔═══════════════════════════════════╗ && echo ║   PaperPress Backend Server       ║ && echo ║   Running on http://localhost:4000 ║ && echo ╚═══════════════════════════════════╝ && echo. && npm run dev"
timeout /t 3 /nobreak >nul

echo    🎨 Starting Frontend Client (port 5173)...
start "PaperPress - Frontend Client" cmd /k "cd /d %CD%\client && echo ╔═══════════════════════════════════╗ && echo ║   PaperPress Frontend Client      ║ && echo ║   Running on http://localhost:5173 ║ && echo ╚═══════════════════════════════════╝ && echo. && npm run dev"
timeout /t 2 /nobreak >nul

REM ============================================
REM Display Success Message
REM ============================================
echo.
echo [7/7] Application is starting...
timeout /t 3 /nobreak >nul
cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          ✨ PaperPress CMS Started Successfully! ✨        ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo   📡 Backend API:     http://localhost:4000
echo   🌐 Frontend App:    http://localhost:5173
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Default Login Credentials                                 ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║  👤 Email:    author@example.com                           ║
echo ║  🔑 Password: password                                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 💡 Tips:
echo    • Frontend will auto-open in your browser shortly
echo    • Check the server windows for logs
echo    • Press Ctrl+C in server windows to stop
echo    • Run stop.bat to stop all services
echo.
echo ⌛ Waiting for services to fully start...
timeout /t 5 /nobreak >nul

REM Open browser automatically
echo 🌐 Opening application in browser...
start http://localhost:5173

echo.
echo ✅ All done! Enjoy using PaperPress CMS!
echo.
echo Press any key to close this window...
pause >nul
