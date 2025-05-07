const http = require('http');
const fs = require('fs');
const path = require('path');

// Generate sample metrics
const generateMetrics = () => {
  // Generate slightly different values each time to simulate changes
  const uptime = (99.5 + Math.random() * 0.5).toFixed(2); // 99.5-100%
  const mttr = (10 + Math.random() * 10).toFixed(1); // 10-20 minutes
  const mtbf = (2000 + Math.random() * 300).toFixed(0); // 2000-2300 minutes
  const errorRate = (Math.random() * 0.2).toFixed(3); // 0-0.2%
  const incidents = Math.floor(1 + Math.random() * 5); // 1-5 incidents
  
  return `# HELP service_uptime Service uptime percentage
# TYPE service_uptime gauge
service_uptime ${uptime}

# HELP service_mttr Mean Time To Recovery in minutes
# TYPE service_mttr gauge
service_mttr ${mttr}

# HELP service_mtbf Mean Time Between Failures in minutes
# TYPE service_mtbf gauge
service_mtbf ${mtbf}

# HELP service_error_rate Service error rate percentage
# TYPE service_error_rate gauge
service_error_rate ${errorRate}

# HELP incident_count Count of open incidents
# TYPE incident_count gauge
incident_count ${incidents}
`;
}

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    // Send metrics in Prometheus format
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(generateMetrics());
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start server
const PORT = 9091;
server.listen(PORT, () => {
  console.log(`Static metrics server running at http://localhost:${PORT}/metrics`);
  console.log('This server provides ITSM metrics for Grafana dashboards');
  console.log('Update prometheus.yml to include this endpoint in scrape configs:');
  console.log(`
scrape_configs:
  - job_name: 'static-itsm-metrics'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['host.docker.internal:${PORT}']
  `);
}); 