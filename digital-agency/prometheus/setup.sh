#!/bin/bash

# This script downloads and sets up Prometheus for monitoring the digital-agency API

# Create directories
mkdir -p prometheus/data

# Download Prometheus (adjust version as needed)
if [ ! -f "prometheus.tar.gz" ]; then
  echo "Downloading Prometheus..."
  curl -LO https://github.com/prometheus/prometheus/releases/download/v2.38.0/prometheus-2.38.0.windows-amd64.tar.gz
  tar -xvzf prometheus-2.38.0.windows-amd64.tar.gz
  mv prometheus-2.38.0.windows-amd64/* prometheus/
  rm -rf prometheus-2.38.0.windows-amd64
  rm prometheus-2.38.0.windows-amd64.tar.gz
  echo "Prometheus downloaded and extracted."
else
  echo "Prometheus already downloaded."
fi

# Copy configuration
cp prometheus.yml prometheus/

echo "Prometheus setup complete. Run with: cd prometheus && ./prometheus.exe --config.file=prometheus.yml" 