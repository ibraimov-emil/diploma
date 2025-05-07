const { spawn } = require('child_process');
const path = require('path');

console.log('Starting static metrics server for ITSM dashboards...');

// Path to the static metrics server script
const staticMetricsPath = path.join(__dirname, '../prometheus/static-metrics.js');

// Spawn the static metrics server process
const staticMetricsProcess = spawn('node', [staticMetricsPath], {
  stdio: 'inherit',
  detached: true
});

staticMetricsProcess.unref();

console.log('Static metrics server started in the background.');
console.log('Now restarting Prometheus to pick up the new configuration...');

// Restart Prometheus to pick up configuration changes
const { exec } = require('child_process');
const prometheusDir = path.join(__dirname, '../prometheus');

exec('docker-compose restart prometheus', { cwd: prometheusDir }, (error, stdout, stderr) => {
  if (error) {
    console.error('Error restarting Prometheus:', error);
    return;
  }
  
  console.log(stdout);
  console.log('Prometheus restarted successfully.');
  console.log('You should now see ITSM metrics in your Grafana dashboards.');
  console.log('Open http://localhost:3000 to access Grafana (username: admin, password: admin)');
}); 