@echo off
REM This script starts MySQL and the backend server automatically
REM Save this file and double-click it to start everything

echo.
echo ========================================
echo 🚀 Online Supershop - Server Launcher
echo ========================================
echo.

REM Check if MySQL is running
echo [1/3] Checking MySQL service...
sc query MySQL80 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MySQL80 service found
) else (
    sc query MySQL57 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ MySQL57 service found
    ) else (
        echo ❌ MySQL service not found!
        echo.
        echo 💡 Please install MySQL from: https://dev.mysql.com/downloads/mysql/
        echo    Or use: MariaDB, XAMPP, or WAMP
        echo.
        pause
        exit /b 1
    )
)

REM Start MySQL80 (or MySQL57)
echo [2/3] Starting MySQL service...
net start MySQL80 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MySQL80 started successfully
) else (
    net start MySQL57 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ MySQL57 started successfully
    ) else (
        echo ⚠️ MySQL may already be running (that's fine)
    )
)

REM Wait a moment for MySQL to fully start
timeout /t 2 /nobreak

REM Start Node.js server
echo [3/3] Starting backend server...
cd /d "%~dp0backend"
node server.js

pause
