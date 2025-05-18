# PowerShell скрипт для запуска всех серверов метрик
Write-Host "Запуск всех серверов метрик..." -ForegroundColor Green

# Запуск ITSM метрик в новом окне PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\start-itsm-metrics.ps1"

# Запуск Process метрик в новом окне PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\start-process-metrics.ps1"

Write-Host "Серверы метрик запущены в отдельных окнах PowerShell" -ForegroundColor Green
Write-Host "ITSM метрики доступны по адресу: http://localhost:9091/metrics" -ForegroundColor Cyan
Write-Host "Process метрики доступны по адресу: http://localhost:9092/metrics" -ForegroundColor Cyan 