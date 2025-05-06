# Monitoring System for Digital Agency Application

This document describes the monitoring and availability system implemented for the Digital Agency application.

## Architecture

The monitoring system is built on the following components:

1. **Health Check API** - NestJS endpoint at `/health` that checks critical systems
2. **Scheduled Checks** - Periodic background jobs that verify system health
3. **Metrics Collection** - Prometheus integration for tracking system performance
4. **Dashboard Visualization** - React-based dashboard for observing system status

## Features

### Health Check API

The health check API (`/health`) provides real-time status information about:
- Database connection
- Memory usage
- Disk space
- Response time

This is implemented using the `@nestjs/terminus` package which provides health check indicators for various system components.

### Metrics Collection

System metrics are collected and stored in:
1. PostgreSQL database in the `service_metrics` table
2. Prometheus time-series database (for visualization)

The metrics collected include:
- API response times
- Success/failure rates
- Database connection status

### Scheduled Health Checks

The system automatically runs health checks every 30 seconds using the `@nestjs/schedule` module. Results are logged and stored for historical analysis.

### Monitoring Dashboard

The monitoring dashboard provides:
- Current system status (UP/DOWN)
- Historical uptime percentage
- Response time trends
- Service availability visualization

## Formula for Calculating Uptime

Uptime is calculated using the formula:

```
Availability = (Uptime / Total Planned Time) × 100%
```

For example, if out of 1440 minutes in a day the service correctly operated for 1420 minutes, the uptime would be:

```
(1420/1440) × 100% = 98.61%
```

## Incident Handling

When a health check fails:
1. The incident is logged in the database
2. A Slack notification is sent (if configured)
3. The status is displayed on the monitoring dashboard

## Setup Instructions

### Prerequisites

- Node.js and npm
- PostgreSQL database
- Prometheus (optional for advanced metrics)

### Installation

1. The necessary dependencies are already included in the project's package.json:
   - @nestjs/terminus
   - @nestjs/schedule
   - nestjs-pino
   - winston
   - prometheus-client

2. To enable Slack notifications, set the following environment variable:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
   ```

3. To start Prometheus for metrics collection:
   ```
   cd prometheus
   ./prometheus.exe --config.file=prometheus.yml
   ```

## Accessing the Dashboard

The monitoring dashboard is available at `/monitoring` in the admin interface. It provides real-time and historical data about system performance.

## API Endpoints

- `GET /health` - Returns current system health
- `GET /metrics` - Returns Prometheus-formatted metrics
- `GET /metrics/uptime` - Returns calculated uptime percentage

## Integration with Other Systems

The monitoring system can be integrated with:
- Grafana for advanced visualization
- PagerDuty for alerts
- External monitoring services via webhooks 