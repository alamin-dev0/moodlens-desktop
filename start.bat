@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Age Node.js install korun: https://nodejs.org & pause & exit /b)
if not exist node_modules (echo Pehle bar install hocche, kichhu minute lagbe... & call npm install)
call npm start
