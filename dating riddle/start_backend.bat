@echo off
echo ====================================================
echo Starting Icebreaker AI Backend (FastAPI)...
echo ====================================================
cd /d "%~dp0backend"
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
