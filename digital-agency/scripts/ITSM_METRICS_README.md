# ITSM Metrics Workaround

This document explains our workaround for the missing ITSM metrics in the Grafana dashboards.

## The Issue

We identified the following issues:

1. The Digital Agency API properly generates test data when calling the `/quality-seed` endpoint
2. The API correctly exposes basic Prometheus metrics at the `/metrics` endpoint
3. Prometheus successfully scrapes these metrics from the API
4. However, the ITSM-specific metrics are missing from the metrics endpoint
5. This is likely due to the `QualityMetricsService` not properly registering the ITSM metrics with Prometheus

## Our Workaround Solution

We implemented a separate static metrics server that provides the ITSM metrics needed for the Grafana dashboards:

1. A Node.js server running on port 9091 that exposes ITSM metrics in Prometheus format
2. Updated Prometheus configuration to scrape from both the API and our static metrics server
3. Scripts to easily start and manage this setup

## How to Use

1. Start the Digital Agency API server:
   ```
   cd digital-agency/srvr
   npm run start:dev
   ```

2. In another terminal, start the monitoring stack with static metrics:
   ```
   cd digital-agency/scripts
   .\start-metrics.bat
   ```

3. Open Grafana at http://localhost:3000 (username: admin, password: admin)

4. View the ITSM Dashboard

## Metrics Provided

The static metrics server provides the following metrics:

- `service_uptime` - Service uptime percentage (99.5-100%)
- `service_mttr` - Mean Time To Recovery in minutes (10-20 minutes)
- `service_mtbf` - Mean Time Between Failures in minutes (2000-2300 minutes)
- `service_error_rate` - Service error rate percentage (0-0.2%)
- `incident_count` - Count of open incidents (1-5 incidents)

Values vary slightly each time they're queried to simulate real-time changes.

## Proper Fix

To fix this issue properly, you should:

1. Check `QualityMetricsService` in the NestJS application:
   - Ensure metrics are properly initialized in the constructor
   - Verify the metrics update logic in the `updatePrometheusMetrics` method
   - Check that the service is properly injected and initialized in the module

2. Make sure the Prometheus client is correctly setup:
   - The registry might not be properly configured
   - The server might be missing the correct metric handlers

3. The test data generation works, but the metrics update mechanism might be broken

## Files Created

- `static-metrics.js` - The static metrics server
- `start-metrics.bat` - Script to start everything
- `manually-register-metrics.js` - Diagnostic tool that attempts to register metrics
- `check-metrics.js` - Tool to verify metrics availability

## Technical Details

The static metrics server runs independently of Docker to avoid networking issues. It's accessible to Prometheus using `host.docker.internal:9091`, which allows the Docker container to access it on your host machine. 