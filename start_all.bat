@echo off
echo ========================================
echo Campus Resource Management System
echo Starting Backend and Frontend
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd Backend\myproject && python manage.py runserver"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd Frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause > nul

taskkill /FI "WindowTitle eq Backend Server*" /T /F
taskkill /FI "WindowTitle eq Frontend Server*" /T /F
