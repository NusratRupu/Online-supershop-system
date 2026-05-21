@echo off
REM Direct MySQL Startup Script - No Service Required
REM This bypasses the Windows service system entirely

title MySQL & Node.js Server - Online Supershop

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   ONLINE SUPERSHOP SYSTEM STARTER
echo ========================================
echo.

REM Kill any existing processes
echo Cleaning up existing processes...
taskkill /F /IM mysqld.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo [STEP 1] Starting MySQL Server...
echo ========================================

REM Check if MySQL exists
if not exist "C:\xampp\mysql\bin\mysqld.exe" (
    echo ERROR: MySQL not found at C:\xampp\mysql\bin\mysqld.exe
    echo Please install XAMPP
    pause
    exit /b 1
)

REM Start MySQL in background
start "MySQL Server" /B C:\xampp\mysql\bin\mysqld.exe --datadir=C:\xampp\mysql\data --port=3306

echo Waiting for MySQL to start...
timeout /t 3 /nobreak >nul

echo Checking MySQL connection...
powershell -Command "& {$connected=$false; for($i=0;$i -lt 10;$i++) { if ((Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -WarningAction SilentlyContinue).TcpTestSucceeded) { $connected=$true; break } Start-Sleep -Seconds 1 } if ($connected) { Write-Host 'MySQL is running!' -ForegroundColor Green } else { Write-Host 'WARNING: MySQL may not be responding' -ForegroundColor Yellow } }" 2>nul

echo.
echo [STEP 2] Starting Backend Server...
echo ========================================
echo.

cd /d "d:\Online Super Shop\Online-supershop-system\backend"

if not exist "package.json" (
    echo ERROR: Backend not found. Checking directory...
    echo Current: %cd%
    pause
    exit /b 1
)

REM Check if node_modules exists, if not install
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Start Node.js server
echo Starting Node.js backend...
echo.
call node server.js

pause
