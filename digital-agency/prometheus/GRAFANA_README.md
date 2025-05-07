# Grafana Integration for Digital Agency

This directory contains the configuration to set up Grafana with Prometheus for advanced visualization of monitoring data.

## Overview

The monitoring setup includes:

1. **Prometheus** - for collecting and storing metrics
2. **Grafana** - for creating dashboards and visualizing metrics

## Quick Start

### Prerequisites

- Docker and Docker Compose installed on your machine

### Starting the Services

#### Windows

Run the setup script:

```bash
setup-grafana.bat
```

#### Linux/Mac

Make the setup script executable and run it:

```bash
chmod +x setup-grafana.sh
./setup-grafana.sh
```

Alternatively, you can start the services directly with Docker Compose:

```bash
docker-compose up -d
```

### Accessing the Services

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000
  - Username: admin
  - Password: admin

## Dashboard Overview

The Grafana setup includes a preconfigured ITSM dashboard that shows:

1. **Service Uptime** - Percentage of time the service is available
2. **Mean Time To Recovery (MTTR)** - Average time to resolve incidents
3. **Mean Time Between Failures (MTBF)** - Average time between system failures
4. **Active Incidents** - Count of open incidents
5. **Service Error Rate** - Percentage of requests resulting in errors

## Metrics Collected

The following metrics are collected and visualized:

- `service_uptime` - Service uptime percentage
- `service_mttr` - Mean Time To Recovery in minutes
- `service_mtbf` - Mean Time Between Failures in minutes
- `service_error_rate` - Service error rate percentage
- `incident_count` - Count of open incidents

## Customizing Dashboards

1. Log in to Grafana at http://localhost:3000
2. Navigate to Dashboards > Browse
3. Select the "Digital Agency ITSM Dashboard"
4. Use the Grafana interface to customize the dashboard

## Adding New Metrics

To add new metrics:

1. Define new Prometheus metrics in the `quality-metrics.service.ts` file
2. Add the metrics to the Grafana dashboard using the Grafana UI

## Troubleshooting

If you encounter issues:

1. Check that Prometheus can connect to the API by visiting http://localhost:9090/targets
2. Verify that metrics are being collected by visiting http://localhost:9090/graph
3. Ensure the Grafana data source is properly configured

## Stopping the Services

To stop all services:

```bash
docker-compose down
```

## Further Documentation

- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/grafana/latest/) 