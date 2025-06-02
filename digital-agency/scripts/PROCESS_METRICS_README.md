# Process Metrics System

This document explains how to use the process metrics monitoring features in the Digital Agency application.

## Overview

The Process Metrics system tracks key business process performance indicators:

1. **Request to Project Conversion Time** - How long it takes to convert client requests into active projects
2. **Chat Response Time** - How quickly employees respond to client messages
3. **Invoice Payment Time** - How long it takes clients to pay invoices
4. **Task Completion Rate** - Percentage of tasks completed on time

## Components

The system consists of:

1. **Backend API** (`/metrics/process/...`) - Provides real process metrics data from the database
2. **Frontend Dashboard** (`/process-metrics`) - Visualizes the metrics with charts and indicators
3. **Mock Data Server** - For testing or demonstration without real data
4. **Prometheus Integration** - For storing time-series metrics data

## Setting Up Mock Data

For development or demonstration purposes, you can use the mock data server:

1. Start the mock process metrics server:
   ```
   # On Windows
   scripts\start-process-metrics.bat
   
   # On Linux/Mac
   bash scripts/start-process-metrics.sh
   ```

2. The server will run on port 9092 and expose metrics at:
   ```
   http://localhost:9092/metrics
   ```

3. To view the server status and current metrics, visit:
   ```
   http://localhost:9092/
   ```

## Prometheus Integration

The metrics are automatically collected by Prometheus if configured correctly:

1. Ensure Prometheus is running (see `/prometheus/README.md`)
2. The `prometheus.yml` configuration has been updated to include:
   ```yaml
   - job_name: 'process-metrics'
     metrics_path: '/metrics'
     static_configs:
       - targets: ['host.docker.internal:9092']
   ```

## Using the Process Metrics Dashboard

The Process Metrics Dashboard is available in the Admin section of the application:

1. Log in as an administrator
2. Navigate to "Администрирование" > "Метрики процессов"
3. View current metrics and historical trends

## Available Metrics

| Metric | Description | Target | Units |
|--------|-------------|--------|-------|
| Request to Project Time | Time from request creation to project initiation | ≤ 24 hours | seconds |
| Chat Response Time | Average time to respond to client messages | ≤ 15 minutes | seconds |
| Invoice Payment Time | Average time for clients to pay invoices | ≤ 72 hours | seconds |
| Task Completion Rate | Percentage of tasks completed by their due date | ≥ 90% | percent |

## Development Notes

- Mock data for frontend development is available in `cli/src/data/dummy.js`
- Backend metrics are calculated in `srvr/src/monitoring/process-metrics.service.ts`
- The frontend component is in `cli/src/components/admin/process-metrics/` 