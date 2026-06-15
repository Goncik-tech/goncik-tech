# Goncik-tech Server Launcher (inteligentny z zapisem danych)

$projectPath = "C:\Users\Ignacy\Documents\OPEN_CODE_CTO_AI"
$port = 8000
$serverUrl = "http://localhost:$port"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Goncik-tech - Serwer z zapisem danych" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Lokalizacja: $projectPath" -ForegroundColor Yellow
Write-Host "Adres:       $serverUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opcje:" -ForegroundColor White
Write-Host "   [S] Start serwera" -ForegroundColor Green
Write-Host "   [O] Otworz w przegladarce" -ForegroundColor Blue
Write-Host "   [X] Wyjscie" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Wybierz opcje"

switch ($choice) {
    "S" {
        Write-Host ""
        Write-Host "Uruchamianie server_api.py na porcie $port..." -ForegroundColor Green
        Write-Host "Nacisnij Ctrl+C aby zatrzymac" -ForegroundColor Yellow
        Write-Host ""

        try {
            $pythonVersion = python --version 2>&1
            Write-Host "Python: $pythonVersion" -ForegroundColor Green
        } catch {
            Write-Host "BLAD: Python nie jest dostepny" -ForegroundColor Red
            exit 1
        }

        try {
            Set-Location $projectPath
            python server_api.py
        } catch {
            Write-Host "BLAD: $_" -ForegroundColor Red
        }
    }
    "O" {
        Start-Process $serverUrl
        Write-Host "Przegladarka otwarta" -ForegroundColor Green
    }
    "X" { exit 0 }
    default { Write-Host "Nieznana opcja" -ForegroundColor Red }
}
