@echo off
echo ====================================================
echo Launching Complete Icebreaker AI Suite for Build Night...
echo ====================================================

start "Icebreaker AI Backend" cmd /c "%~dp0start_backend.bat"
start "Icebreaker AI Frontend" cmd /c "%~dp0start_frontend.bat"

echo Waiting for servers to initialize...
timeout /t 4 /nobreak > nul

start http://localhost:5173
echo Icebreaker AI is now running at http://localhost:5173!
