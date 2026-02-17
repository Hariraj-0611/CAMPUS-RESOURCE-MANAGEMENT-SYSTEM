@echo off
echo ========================================
echo Fixing Database Migrations
echo ========================================
echo.

cd Backend\myproject

echo Step 1: Creating migrations for myapp...
python manage.py makemigrations myapp

echo.
echo Step 2: Running migrations...
python manage.py migrate

echo.
echo ========================================
echo Migrations Complete!
echo ========================================
echo.
echo Now you can run the server with:
echo   python manage.py runserver
echo.
pause
