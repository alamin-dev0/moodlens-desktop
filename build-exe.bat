@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Age Node.js install korun: https://nodejs.org & pause & exit /b)
call npm install
call npm run dist
echo.
echo Shesh! dist folder er bhitore MoodLens AI .exe file pabenn.
pause
