@echo off
echo ========================================
echo   Upload.IT - Setup Script
echo ========================================
echo.

echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Error installing backend dependencies
    exit /b 1
)
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Error installing frontend dependencies
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Open a terminal and run: cd backend ^& npm start
echo 2. Open another terminal and run: cd frontend ^& npm start
echo.
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
pause
