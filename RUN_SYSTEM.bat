@echo off
REM This batch file manually starts MySQL and your backend server

echo.
echo ========================================
echo STARTING ONLINE SUPERSHOP SYSTEM
echo ========================================
echo.

REM Kill any existing node/mysql processes
taskkill /F /IM mysqld.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

timeout /t 2 /nobreak

echo [1/2] Starting MySQL...
REM Start MySQL directly
cd /d C:\xampp\mysql\bin
start mysqld.exe --datadir=C:\xampp\mysql\data

REM Wait for MySQL to start
timeout /t 5 /nobreak

echo.
echo [2/2] Starting Backend Server...
cd /d "d:\Online Super Shop\Online-supershop-system\backend"
node server.js

pause
