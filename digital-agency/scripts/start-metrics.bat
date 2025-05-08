@echo off
echo Starting ITSM dashboard stack...

REM Start static metrics server
echo Starting static metrics server...
start "Static Metrics Server" node ../prometheus/static-metrics.js

REM Wait a moment for the server to start
timeout /t 3 /nobreak >NUL

REM Restart Prometheus
echo Restarting Prometheus...
cd ../prometheus
docker-compose restart prometheus

REM Wait for Grafana to be ready
echo Waiting for Grafana to be ready...
timeout /t 10 /nobreak >NUL

REM Import process metrics dashboard
echo Importing process metrics dashboard...
cd ../scripts
node import-process-dashboard.js

echo.
echo ====================================================
echo ITSM Dashboard Setup Complete!
echo.
echo Static metrics server: http://localhost:9091/metrics
echo Prometheus: http://localhost:9090
echo Grafana: http://localhost:3000 (admin/admin)
echo.
echo Process Metrics Dashboard: http://localhost:3000/d/process-metrics/process-metrics-dashboard
echo.
echo You should now see data in your ITSM dashboard
echo ==================================================== 