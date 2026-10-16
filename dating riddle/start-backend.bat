@echo off
echo ========================================================
echo Starting Icebreaker AI Backend Server...
echo Database: backend\app\data\icebreaker.db
echo API Docs: http://localhost:8000/docs
echo ========================================================
cd /d "%~dp0backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
