# Digital Agency ITSM Monitoring

This directory contains the configuration for monitoring ITSM metrics using Prometheus and Grafana.

## Architecture

The monitoring setup consists of:

1. **Prometheus** - Time series database that scrapes and stores metrics
2. **Grafana** - Visualization tool for creating dashboards
3. **Digital Agency NestJS API** - Exposes metrics endpoints for Prometheus

The API exposes the following metrics:
- Service uptime
- Mean Time To Recovery (MTTR)
- Mean Time Between Failures (MTBF)
- Error rates
- Incident counts

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js
- Digital Agency API running on port 5000

### Installation and Setup

1. Start the monitoring stack:

   **Windows:**
   ```
   .\scripts\start-monitoring.bat
   ```

   **Linux/macOS:**
   ```
   chmod +x ./scripts/start-monitoring.sh
   ./scripts/start-monitoring.sh
   ```

2. Access Grafana at http://localhost:3000 (username: admin, password: admin)

3. If no data appears in the dashboards, run the test data generator:
   ```
   cd scripts
   node generate-test-data.js
   ```

## Configuration Files

- `docker-compose.yml` - Container configuration for Prometheus and Grafana
- `prometheus.yml` - Prometheus scraping configuration
- `grafana/provisioning/` - Grafana datasources and dashboards

## Troubleshooting

1. Ensure the Digital Agency API is running on port 5000
2. Check Prometheus targets at http://localhost:9090/targets
3. Verify Docker containers are running with `docker ps`
4. Check logs with `docker logs prometheus` or `docker logs grafana`
5. The API must be reachable from the Prometheus container

## Metrics Collection

The QualityMetricsService in the Digital Agency API updates metrics every 60 seconds by querying the database for:
- Latest service metrics
- Current number of open incidents

These metrics are exposed through the `/metrics` endpoint and formatted according to the Prometheus exposition format.

## Dashboard Customization

Additional dashboards can be created in Grafana by:
1. Creating a JSON dashboard definition
2. Placing it in `grafana/provisioning/dashboards/`
3. Updating `grafana/provisioning/dashboards/dashboard.yml` if needed

## References

- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Digital Agency API Documentation](http://localhost:5000/api/docs) 