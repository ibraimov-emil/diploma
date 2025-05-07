const fetch = require('node-fetch');

async function registerMetrics() {
  console.log('Manually registering ITSM metrics...');
  
  // First, generate test data
  try {
    const seedResponse = await fetch('http://localhost:5000/quality-seed', {
      method: 'POST'
    });
    
    if (seedResponse.ok) {
      console.log('Test data generation successful!');
    } else {
      console.error('Failed to generate test data');
      return;
    }
  } catch (error) {
    console.error('Error generating test data:', error.message);
    return;
  }
  
  // Wait a moment for metrics to be updated
  console.log('Waiting 5 seconds for metrics to be updated...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Check if metrics are now available
  try {
    const metricsResponse = await fetch('http://localhost:5000/metrics');
    const metricsText = await metricsResponse.text();
    
    const itsmMetrics = [
      'service_uptime',
      'service_mttr',
      'service_mtbf',
      'service_error_rate',
      'incident_count'
    ];
    
    let foundMetrics = 0;
    for (const metric of itsmMetrics) {
      if (metricsText.includes(metric)) {
        console.log(`✓ Found metric: ${metric}`);
        foundMetrics++;
      } else {
        console.log(`✗ Missing metric: ${metric}`);
      }
    }
    
    if (foundMetrics === 0) {
      console.log('\nISSUE DETECTED: ITSM metrics are still not available.');
      console.log('This means the QualityMetricsService metrics may not be properly registered with Prometheus.');
      
      // Workaround: Create fake metrics for testing Grafana
      console.log('\nCreating fake metrics file for testing...');
      createFakeMetricsFile();
      
      console.log('\nTry these troubleshooting steps:');
      console.log('1. Check if QualityMetricsService is properly injected in the module');
      console.log('2. Verify the metrics are correctly initialized in the service');
      console.log('3. Check if the metrics are being updated after data is generated');
    } else {
      console.log(`\nFound ${foundMetrics}/${itsmMetrics.length} ITSM metrics. Grafana should display them now.`);
    }
  } catch (error) {
    console.error('Error checking metrics:', error.message);
  }
}

function createFakeMetricsFile() {
  const fs = require('fs');
  const path = require('path');
  
  const prometheusDir = path.join(__dirname, '../prometheus');
  const fakeMetricsFile = path.join(prometheusDir, 'fake_metrics.txt');
  
  // Create fake metrics in Prometheus format
  const fakeMetrics = `# HELP service_uptime Service uptime percentage
# TYPE service_uptime gauge
service_uptime 99.95

# HELP service_mttr Mean Time To Recovery in minutes
# TYPE service_mttr gauge
service_mttr 15.5

# HELP service_mtbf Mean Time Between Failures in minutes
# TYPE service_mtbf gauge
service_mtbf 2160.0

# HELP service_error_rate Service error rate percentage
# TYPE service_error_rate gauge
service_error_rate 0.03

# HELP incident_count Count of open incidents
# TYPE incident_count gauge
incident_count 3.0
`;

  try {
    fs.writeFileSync(fakeMetricsFile, fakeMetrics);
    console.log(`Created fake metrics file at ${fakeMetricsFile}`);
    console.log('You can use this file to test your Grafana dashboards by importing it into Prometheus.');
    console.log('\nTo use this file with Prometheus:');
    console.log('1. Add a file-based scrape config to prometheus.yml:');
    console.log(`
scrape_configs:
  - job_name: 'file'
    file_sd_configs:
      - files:
        - 'fake_metrics.txt'
`);
  } catch (error) {
    console.error('Failed to create fake metrics file:', error.message);
  }
}

registerMetrics(); 