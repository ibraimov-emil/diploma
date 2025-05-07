@echo off
echo Stopping and removing existing monitoring containers...

cd ../prometheus
docker-compose down

echo.
echo Starting Prometheus and Grafana monitoring stack with updated configuration...
docker-compose up -d

echo.
echo Waiting for services to start up...
timeout /t 5 /nobreak >NUL

echo.
echo Checking if NestJS server is running...
curl -s http://localhost:5000/health >NUL
if %ERRORLEVEL% NEQ 0 (
    echo The Digital Agency API is not running!
    echo Please start the server first with: npm run start:dev
    echo Then run this script again.
    exit /b 1
)

echo.
echo Checking if metrics endpoint is available...
cd ../scripts
node check-metrics.js

echo.
echo If metrics are not available, generating test data...
node generate-test-data.js

echo.
echo ====================================================
echo Monitoring restart complete!
echo.
echo Prometheus: http://localhost:9090
echo Grafana: http://localhost:3000 (admin/admin)
echo.
echo Checking Prometheus targets...
echo Open http://localhost:9090/targets to verify the API is being scraped
echo.
echo If data still doesn't appear in Grafana:
echo 1. Ensure the host.docker.internal resolves correctly in Prometheus
echo 2. Check Docker network connectivity between containers
echo 3. Restart your Digital Agency API server
echo ==================================================== 