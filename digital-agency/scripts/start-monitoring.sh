#!/bin/bash

echo "Starting Prometheus and Grafana monitoring stack..."

cd ../prometheus
docker-compose up -d

echo
echo "Waiting for services to start up..."
sleep 5

echo
echo "Checking if NestJS server is running..."
if ! curl -s http://localhost:5000/health &>/dev/null; then
    echo "The Digital Agency API is not running!"
    echo "Please start the server first with: npm run start:dev"
    echo "Then run this script again."
    exit 1
fi

echo
echo "Digital Agency API is running."
echo "Generating test data for metrics..."

cd ../scripts
node generate-test-data.js

echo
echo "===================================================="
echo "Monitoring setup complete!"
echo
echo "Prometheus: http://localhost:9090"
echo "Grafana: http://localhost:3000 (admin/admin)"
echo
echo "If no data appears in Grafana:"
echo "1. Ensure the API server is reachable from Prometheus"
echo "2. Check Prometheus targets at http://localhost:9090/targets"
echo "3. Run the generate-test-data.js script again if needed"
echo "====================================================" 