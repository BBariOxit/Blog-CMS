@echo off
echo ====================================
echo   PaperPress CMS - Stopping Services
echo ====================================
echo.

REM Kill Node.js processes
echo [INFO] Stopping Node.js processes...
taskkill /F /IM node.exe >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Node.js processes stopped!
) else (
    echo [INFO] No Node.js processes running.
)

REM Stop Docker containers
if exist docker-compose.yml (
    where docker >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo [INFO] Stopping Docker containers...
        docker-compose down
        echo [SUCCESS] Docker containers stopped!
    )
)

echo.
echo [SUCCESS] All services stopped!
echo.
pause
