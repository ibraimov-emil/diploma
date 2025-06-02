const http = require('http');

// Generate process metrics
const generateProcessMetrics = () => {
  // Create variations to simulate real-time changes
  const variation = () => 0.9 + Math.random() * 0.2; // Random values between 0.9 and 1.1
  
  // Base values (similar to our dummy.js data)
  const baseRequestToProject = 86400; // 24 hours in seconds
  const baseChatResponse = 900; // 15 minutes in seconds
  const baseInvoicePayment = 259200; // 72 hours in seconds
  const baseTaskCompletion = 0.9; // 90%
  
  // Add variations
  const requestToProject = Math.floor(baseRequestToProject * variation());
  const chatResponse = Math.floor(baseChatResponse * variation());
  const invoicePayment = Math.floor(baseInvoicePayment * variation());
  const taskCompletion = (baseTaskCompletion * variation()).toFixed(2);
  
  return `# HELP request_to_project_time_seconds Time to convert request to project
# TYPE request_to_project_time_seconds gauge
request_to_project_time_seconds ${requestToProject}

# HELP chat_response_time_seconds Time to respond to chat messages
# TYPE chat_response_time_seconds gauge
chat_response_time_seconds ${chatResponse}

# HELP invoice_payment_time_seconds Time from invoice to payment
# TYPE invoice_payment_time_seconds gauge
invoice_payment_time_seconds ${invoicePayment}

# HELP task_completion_rate Percentage of tasks completed on time
# TYPE task_completion_rate gauge
task_completion_rate ${taskCompletion}

# HELP sla_compliance_count Number of SLAs currently being met
# TYPE sla_compliance_count gauge
sla_compliance_count ${Math.floor(3 + Math.random())}
`;
}

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    // Send metrics in Prometheus format
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(generateProcessMetrics());
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head>
          <title>Process Metrics Server</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
            h1 { color: #333; }
            .endpoint { font-weight: bold; color: #0066cc; }
          </style>
        </head>
        <body>
          <h1>Process Metrics Mock Server</h1>
          <p>This server provides process metrics for the Digital Agency monitoring system.</p>
          <p>Available endpoint: <span class="endpoint">/metrics</span></p>
          <h2>Current Metrics:</h2>
          <pre>${generateProcessMetrics()}</pre>
          <p>Refresh the page to see new random values.</p>
        </body>
      </html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start server
const PORT = 9092;
server.listen(PORT, () => {
  console.log(`Process metrics server running at http://localhost:${PORT}`);
  console.log('This server provides process metrics for the Digital Agency monitoring dashboard');
  console.log('Metrics are available at: http://localhost:9092/metrics');
  console.log('Update prometheus.yml to include this endpoint:');
  console.log(`
scrape_configs:
  - job_name: 'process-metrics'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['host.docker.internal:${PORT}']
  `);
}); 