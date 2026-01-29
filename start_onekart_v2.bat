@echo off
echo ==========================================
echo       Starting OneKart System (v2)
echo ==========================================

echo 1. Stopping any existing XAMPP processes...
taskkill /F /IM httpd.exe >nul 2>&1
taskkill /F /IM mysqld.exe >nul 2>&1

echo 2. Starting Apache...
start "XAMPP Apache" "C:\xampp\apache_start.bat"

echo 3. Starting MySQL...
start "XAMPP MySQL" "C:\xampp\mysql_start.bat"

echo 4. Waiting for servers to initialize (5 seconds)...
timeout /t 5

echo 5. Opening Frontend...
start http://localhost/OneKart/onekart-frontend/

echo Success: OneKart is live on http://localhost/OneKart/
pause
