@echo off
chcp 65001 >nul
title Goncik-tech - Szybki Start

echo ========================================
echo   GONCIK-TECH - Szybki Start 🚀
echo ========================================
echo.
echo Lokalizacja: C:\Users\Ignacy\Documents\OPEN_CODE_CTO_AI
echo Adres: http://localhost:8000
echo.

REM Sprawdź czy Python jest dostępny
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Błąd: Python nie jest dostępny
    echo.
    echo Zainstaluj Python 3+ lub użyj innego serwera
    echo Dostępne opcje:
    echo    1. Zainstaluj Python: https://www.python.org/downloads/
    echo    2. Użyj Node.js: npx http-server
    echo    3. Użyj VS Code Live Server
    echo.
    pause
    exit /b 1
)

echo ✅ Python dostępny
echo.

REM Zapytaj o przeglądarkę
set /p OPEN_BROWSER="Czy automatycznie otworzyć przeglądarkę? (T/N): "
echo.

REM Uruchom serwer
echo 🚀 Uruchamianie serwera...
echo    Naciśnij Ctrl+C aby zatrzymać serwer
echo.

cd /d "C:\Users\Ignacy\Documents\OPEN_CODE_CTO_AI"

if /i "%OPEN_BROWSER%"=="T" goto WITH_BROWSER
if /i "%OPEN_BROWSER%"=="t" goto WITH_BROWSER
if "%OPEN_BROWSER%"=="" goto WITH_BROWSER

REM Bez przeglądarki
goto WITHOUT_BROWSER

:WITH_BROWSER
REM Uruchom w nowym oknie
start /min python -m http.server 8000

REM Czekaj 2 sekundy
timeout /t 2 /nobreak >nul

REM Spróbuj połączyć się
curl -s -o nul -w "%%{http_code}" http://localhost:8000 | findstr "200" >nul
if errorlevel 1 (
    echo ❌ Błąd: Serwer nie odpowiada
    pause
    exit /b 1
)

echo ✅ Serwer uruchomiony pomyślnie!
echo.
echo 🌐 Otwieranie przeglądarki...
start http://localhost:8000

echo.
echo 🎉 Strona dostępna pod: http://localhost:8000
echo.
echo ⚠️  Serwer działa w tle.
echo    Aby zatrzymać zamknij okno terminala lub naciśnij Ctrl+C
echo.
pause
exit /b 0

:WITHOUT_BROWSER
echo Serwer uruchomiony.
echo Otwórz przeglądarkę i wpisz: http://localhost:8000
echo.
python -m http.server 8000
exit /b 0