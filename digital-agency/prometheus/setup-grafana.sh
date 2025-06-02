#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker could not be found. Please install Docker before running this script."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose could not be found. Please install Docker Compose before running this script."
    exit 1
fi

echo "Starting Prometheus and Grafana..."
docker-compose up -d

echo ""
echo "Setup complete!"
echo "Access Prometheus at: http://localhost:9090"
echo "Access Grafana at: http://localhost:3000"
echo "  - Username: admin"
echo "  - Password: admin"
echo ""
echo "To stop the services, run: docker-compose down" 