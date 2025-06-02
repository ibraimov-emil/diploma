@echo off
echo Starting Process Metrics Server...
cd %~dp0..\prometheus
node static-process-metrics.js 