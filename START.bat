@echo off
cd /d "C:\Users\Ignacy\Documents\OPEN_CODE_CTO_AI"
echo Uruchamianie serwera w tle...
start "Goncik-tech" cmd /k "python server_api.py"
timeout /t 3 /nobreak >nul
start http://localhost:8000
