# Goncik-tech - Skrypt Startowy
# Szybki start serwera i otwarcie w przeglądarce

$ErrorActionPreference = "Stop"

# Kolory do konsoli
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "========================================"
Write-ColorOutput Green "  GONCIK-TECH - Szybki Start 🚀"
Write-ColorOutput Green "========================================"
Write-Output ""

# Ustawienia
$projectPath = "C:\Users\Ignacy\Documents\OPEN_CODE_CTO_AI"
$port = 8000
$serverUrl = "http://localhost:$port"

# Sprawdź ścieżkę projektu
if (-not (Test-Path $projectPath)) {
    Write-ColorOutput Red "❌ Błąd: Ścieżka projektu nie istnieje"
    Write-ColorOutput Yellow "   $projectPath"
    Write-Output ""
    Write-ColorOutput Yellow "Proszę utworzyć katalog projektu lub poprawić ścieżkę"
    Read-Host "Naciśnij Enter aby zakończyć"
    exit 1
}

Write-ColorOutput Cyan "📁 Lokalizacja: $projectPath"
Write-ColorOutput Cyan "🌐 Adres: $serverUrl"
Write-Output ""

# Sprawdź czy Python jest dostępny
try {
    $pythonOutput = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput Green "✅ Python dostępny: $pythonOutput"
    } else {
        throw "Python nie odpowiedział"
    }
} catch {
    Write-ColorOutput Red "❌ Błąd: Python nie jest dostępny"
    Write-ColorOutput Yellow "   Zainstaluj Python 3+ lub użyj innego serwera"
    Write-Output ""
    Write-ColorOutput Yellow "Dostępne opcje:"
    Write-ColorOutput Yellow "   1. Zainstaluj Python: https://www.python.org/downloads/"
    Write-ColorOutput Yellow "   2. Użyj Node.js: npx http-server"
    Write-ColorOutput Yellow "   3. Użyj VS Code Live Server"
    Read-Host "Naciśnij Enter aby zakończyć"
    exit 1
}

Write-Output ""

# Zapytaj czy automatycznie otworzyć przeglądarkę
$openBrowser = Read-Host "Czy automatycznie otworzyć przeglądarkę? (T/N)"
Write-Output ""

# Uruchom serwer
Write-ColorOutput Yellow "🚀 Uruchamianie serwera Python..."
Write-ColorOutput Yellow "   Naciśnij Ctrl+C aby zatrzymać serwer"
Write-Output ""

try {
    cd $projectPath

    if ($openBrowser -eq "T" -or $openBrowser -eq "t" -or $openBrowser -eq "") {
        # Uruchom serwer w tle i otwórz przeglądarkę
        $pythonProcess = Start-Process -FilePath "python" -ArgumentList "-m http.server $port" -NoNewWindow -PassThru

        Write-ColorOutput Cyan "⏳ Oczekiwanie na start serwera..."
        Start-Sleep -Seconds 2

        # Sprawdź czy serwer działa
        try {
            $response = Invoke-WebRequest -Uri $serverUrl -TimeoutSec 2 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-ColorOutput Green "✅ Serwer uruchomiony pomyślnie!"
                Write-ColorOutput Green "   Status: $($response.StatusCode)"

                Write-Output ""
                Write-ColorOutput Cyan "🌐 Otwieranie przeglądarki..."
                Start-Process $serverUrl

                Write-Output ""
                Write-ColorOutput Green "🎉 Strona dostępna pod: $serverUrl"
            } else {
                Write-ColorOutput Red "❌ Błąd: Serwer nie odpowiada poprawnie"
                Write-ColorOutput Yellow "   Status: $($response.StatusCode)"
                Stop-Process -Id $pythonProcess.Id -Force
                exit 1
            }
        } catch {
            Write-ColorOutput Red "❌ Błąd: Nie udało się połączyć z serwerem"
            Write-ColorOutput Yellow "   $($_.Exception.Message)"
            Stop-Process -Id $pythonProcess.Id -Force
            exit 1
        }

        Write-Output ""
        Write-ColorOutput Yellow "⚠️  Serwer działa w tle. Aby zatrzymać:"
        Write-ColorOutput Yellow "   1. Znajdź okno terminala"
        Write-ColorOutput Yellow "   2. Naciśnij Ctrl+C"
        Write-Output ""
        Write-ColorOutput Cyan "Lub zamknij to okno terminala"

        # Czekaj na użytkownika
        try {
            Write-Output ""
            Read-Host "Naciśnij Enter aby zatrzymać serwer i zakończyć"
        } finally {
            Write-ColorOutput Yellow "🛑 Zatrzymywanie serwera..."
            Stop-Process -Id $pythonProcess.Id -Force
            Write-ColorOutput Green "✅ Serwer zatrzymany"
        }
    } else {
        # Uruchom serwer normalnie
        python -m http.server $port
    }
} catch {
    Write-ColorOutput Red "❌ Błąd podczas uruchamiania: $_"
    exit 1
}

Write-Output ""
Write-ColorOutput Green "========================================"
Write-ColorOutput Green "  Dziękujemy za użycie Goncik-tech!"
Write-ColorOutput Green "========================================"