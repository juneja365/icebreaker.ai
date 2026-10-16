@echo off
echo ====================================================
echo Starting Icebreaker AI Frontend (React + Vite)...
echo ====================================================
cd /d "%~dp0frontend"
call npm install
call npm run dev
pause
