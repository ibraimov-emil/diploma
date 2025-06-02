@echo off
echo Checking if Docker is installed...
docker --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Docker could not be found. Please install Docker before running this script.
    exit /b 1
)

echo Checking if Docker Compose is installed...
docker-compose --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Docker Compose could not be found. Please install Docker Compose before running this script.
    exit /b 1
)

echo Starting Prometheus and Grafana...
docker-compose up -d

echo.
echo Setup complete!
echo Access Prometheus at: http://localhost:9090
echo Access Grafana at: http://localhost:3000
echo   - Username: admin
echo   - Password: admin
echo.
echo To stop the services, run: docker-compose down
pause 