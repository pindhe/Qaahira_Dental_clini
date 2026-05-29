@echo off
echo ====================================
echo Dental Clinic - Setup Script
echo ====================================
echo.

echo Step 1: Creating migrations...
python manage.py makemigrations
echo.

echo Step 2: Applying migrations...
python manage.py migrate
echo.

echo Step 3: Creating superuser (you will be prompted for details)...
python manage.py createsuperuser
echo.

echo ====================================
echo Setup complete!
echo ====================================
echo.
echo To start the server, run:
echo   python manage.py runserver
echo.
echo Then visit:
echo   http://127.0.0.1:8000/
echo.

pause


