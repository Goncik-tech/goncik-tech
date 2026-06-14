# Goncik-tech Server Launcher
# Uruchom ten skrypt aby wystartować serwer lokalny

$projectPath = "C:\Users\Ignacy\Documents\OPEN_CODE_CTO_AI"
$port = 8000
$serverUrl = "http://localhost:$port"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Goncik-tech - Serwer Lokalny" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Lokalizacja: $projectPath" -ForegroundColor Yellow
Write-Host "🌐 Adres serwera: $serverUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Opcje:" -ForegroundColor White
Write-Host "   [S] Start serwera" -ForegroundColor Green
Write-Host "   [O] Otwórz w przeglądarce" -ForegroundColor Blue
Write-Host "   [X] Wyjście" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Wybierz opcję"

switch ($choice) {
    "S" {
        Write-Host ""
        Write-Host "🚀 Uruchamianie serwera Python na porcie $port..." -ForegroundColor Green
        Write-Host "   Naciśnij Ctrl+C aby zatrzymać serwer" -ForegroundColor Yellow
        Write-Host ""

        # Sprawdź czy Python jest dostępny
        try {
            $pythonVersion = python --version 2>&1
            Write-Host "✅ Python dostępny: $pythonVersion" -ForegroundColor Green
        } catch {
            Write-Host "❌ Błąd: Python nie jest dostępny" -ForegroundColor Red
            Write-Host "   Zainstaluj Python 3 lub użyj start_server.bat" -ForegroundColor Yellow
            exit 1
        }

        # Uruchom serwer
        try {
            Start-Process -FilePath "python" -ArgumentList "-m http.server $port" -WorkingDirectory $projectPath -NoNewWindow -Wait
        } catch {
            Write-Host "❌ Błąd podczas uruchamiania serwera: $_" -ForegroundColor Red
        }
    }

    "O" {
        Write-Host ""
        Write-Host "🌐 Otwieranie $serverUrl w przeglądarce..." -ForegroundColor Blue
        Start-Process $serverUrl
        Write-Host "✅ Przeglądarka otwarta" -ForegroundColor Green
    }

    "X" {
        Write-Host ""
        Write-Host "👋 Zamykanie..." -ForegroundColor Yellow
        exit 0
    }

    default {
        Write-Host ""
        Write-Host "❌ Nieznana opcja: $choice" -ForegroundColor Red
        Write-Host "   Spróbuj ponownie" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Dziękujemy za użycie Goncik-tech!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan