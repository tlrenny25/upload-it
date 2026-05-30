@echo off
title Upload.IT - Development Server
echo ========================================
echo   Upload.IT - Development Server
echo ========================================
echo.
echo Starting backend server...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak

echo Starting frontend development server...
start cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
pause
