@echo off
echo ==========================================
echo       Starting OneKart System
echo ==========================================

echo 1. Starting Apache...
start "XAMPP Apache" /MIN "C:\xampp\apache_start.bat"

echo 2. Starting MySQL...
start "XAMPP MySQL" /MIN "C:\xampp\mysql_start.bat"

echo 3. Opening Frontend...
start http://localhost/OneKart/onekart-frontend/

echo Status: OneKart is running via XAMPP.
pause
