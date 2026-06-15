# Goncik-tech - Skrypt Startowy
# Szybki start serwera i otwarcie w przegladarce

$ErrorActionPreference = "Stop"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) { Write-Output $args }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "========================================"
Write-ColorOutput Green "  GONCIK-TECH - Szybki Start"
Write-ColorOutput Green "========================================"
Write-Output ""

$projectPath = "C:\Users\Ignacy\Documents\OPEN_CODE_CTO_AI"
$port = 8000
$serverUrl = "http://localhost:$port"

if (-not (Test-Path $projectPath)) {
    Write-ColorOutput Red "BLAD: Sciezka projektu nie istnieje: $projectPath"
    Read-Host "Enter"
    exit 1
}

Write-ColorOutput Cyan "Projekt: $projectPath"
Write-ColorOutput Cyan "Adres:   $serverUrl"
Write-Output ""

try {
    $pythonOutput = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput Green "Python: $pythonOutput"
    } else { throw "no python" }
} catch {
    Write-ColorOutput Red "BLAD: Python nie jest dostepny"
    Read-Host "Enter"
    exit 1
}

Write-Output ""
$openBrowser = Read-Host "Czy automatycznie otworzyc przegladarke? (T/N)"

Write-ColorOutput Yellow "Uruchamianie server_api.py..."
Write-ColorOutput Yellow "Nacisnij Ctrl+C aby zatrzymac"
Write-Output ""

try {
    Set-Location $projectPath

    if ($openBrowser -eq "T" -or $openBrowser -eq "t" -or $openBrowser -eq "") {
        $proc = Start-Process -FilePath "python" -ArgumentList "server_api.py" -NoNewWindow -PassThru
        Start-Sleep -Seconds 2
        try {
            $response = Invoke-WebRequest -Uri $serverUrl -TimeoutSec 3 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-ColorOutput Green "Serwer OK"
                Start-Process $serverUrl
                Write-ColorOutput Cyan "Strona dostepna: $serverUrl"
            }
        } catch {
            Write-ColorOutput Red "BLAD polaczenia: $($_.Exception.Message)"
            Stop-Process -Id $proc.Id -Force
            exit 1
        }
        Write-Output ""
        Read-Host "Enter aby zatrzymac serwer"
        Stop-Process -Id $proc.Id -Force
    } else {
        python server_api.py
    }
} catch {
    Write-ColorOutput Red "BLAD: $_"
    exit 1
}
