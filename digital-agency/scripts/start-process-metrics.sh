#!/bin/bash
echo "Starting Process Metrics Server..."
cd "$(dirname "$0")/../prometheus"
node static-process-metrics.js 