# Troubleshooting Grafana Data Issues

If no data is appearing in your Grafana dashboards, follow these steps to resolve the issue:

## 1. Start the API Server

First, make sure the Digital Agency API server is running:

```bash
# Open a terminal and run:
cd digital-agency/srvr
npm run start:dev
```

## 2. Check Metrics Endpoint

Verify that the metrics endpoint is accessible and returning data:

```bash
# In a new terminal:
cd digital-agency/scripts
node check-metrics.js
```

If no metrics are found, generate test data:

```bash
node generate-test-data.js
```

## 3. Restart the Monitoring Stack

With the API server running, restart the Prometheus and Grafana stack:

```bash
# In a new terminal:
cd digital-agency/scripts
.\restart-monitoring.bat   # Windows
# OR
./restart-monitoring.sh    # Linux/macOS
```

## 4. Check Prometheus Target Status

Open http://localhost:9090/targets in your browser and check if the digital-agency-api target is showing as "UP". If it shows "DOWN", there's a connectivity issue.

## 5. Docker Network Configuration

The key change we made is to update the Prometheus configuration to use `host.docker.internal` instead of `localhost`. This allows Prometheus running in Docker to access your host machine where the API is running.

In the `docker-compose.yml`, we added:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

This ensures that `host.docker.internal` resolves to your host machine's IP address.

## 6. Verify Dashboard Configuration

1. Open Grafana at http://localhost:3000 (login: admin/admin)
2. Go to Dashboards > Browse
3. You should see the ITSM Dashboard
4. Check the dashboard's data source configuration (should be set to "Prometheus")

## 7. Manual Data Generation

If metrics still don't appear, run the data generator again:

```bash
cd digital-agency/scripts
node generate-test-data.js
```

## 8. Check Docker Network

If issues persist, check Docker network connectivity:

```bash
docker network inspect prometheus_monitoring
```

## 9. Restart Everything

As a last resort, restart everything:

1. Stop the API server (Ctrl+C)
2. Stop Docker containers: `cd digital-agency/prometheus && docker-compose down`
3. Start the API server: `cd digital-agency/srvr && npm run start:dev`
4. In a new terminal, start monitoring: `cd digital-agency/scripts && .\restart-monitoring.bat` 