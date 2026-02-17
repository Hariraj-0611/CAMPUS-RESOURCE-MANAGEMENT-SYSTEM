@echo off
echo ========================================
echo Campus Resource Management System
echo Frontend Setup Script
echo ========================================
echo.

echo Installing Node.js dependencies...
cd Frontend
npm install
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the frontend server, run:
echo   cd Frontend
echo   npm run dev
echo.
echo Frontend will be available at: http://localhost:5173
echo.
pause
