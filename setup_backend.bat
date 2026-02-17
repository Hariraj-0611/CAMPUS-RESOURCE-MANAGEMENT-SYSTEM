@echo off
echo ========================================
echo Campus Resource Management System
echo Backend Setup Script
echo ========================================
echo.

echo Step 1: Installing Python dependencies...
cd Backend
pip install -r requirements.txt
echo.

echo Step 2: Setting up database...
cd myproject
python manage.py makemigrations myapp
python manage.py migrate
echo.

echo Step 3: Database setup complete!
echo.
echo ========================================
echo IMPORTANT: Create an admin user
echo ========================================
python manage.py createsuperuser
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the backend server, run:
echo   cd Backend\myproject
echo   python manage.py runserver
echo.
echo Backend will be available at: http://localhost:8000
echo API endpoints at: http://localhost:8000/api/
echo.
pause
