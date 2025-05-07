const fetch = require('node-fetch');
const metricsUrl = 'http://localhost:5000/metrics';

async function checkMetrics() {
  console.log('Checking if the metrics endpoint is accessible...');
  
  try {
    const response = await fetch(metricsUrl);
    
    if (response.ok) {
      const metricsText = await response.text();
      console.log('Metrics endpoint is accessible!');
      
      if (metricsText.length > 0) {
        console.log(`Metrics data length: ${metricsText.length} bytes`);
        
        // Check for specific ITSM metrics
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
          console.log('\nNo ITSM metrics found.');
          console.log('Looking for other Prometheus metrics...');
          
          const defaultMetrics = [
            'process_cpu',
            'nodejs_heap',
            'nodejs_eventloop',
            'http_request'
          ];
          
          let foundDefaultMetrics = 0;
          for (const metric of defaultMetrics) {
            if (metricsText.includes(metric)) {
              console.log(`✓ Found default metric: ${metric}`);
              foundDefaultMetrics++;
            }
          }
          
          if (foundDefaultMetrics > 0) {
            console.log('\nBasic Prometheus metrics are available but ITSM-specific metrics are missing.');
            console.log('This likely means:');
            console.log('1. Test data was generated but metrics collector is not working');
            console.log('2. The QualityMetricsService might not be properly updating Prometheus gauges');
            console.log('\nTry checking:');
            console.log('- If QualityMetricsService is being initialized correctly');
            console.log('- If metrics are being updated after test data generation');
          }
          
          console.log('\nFirst 500 characters of metrics response:');
          console.log(metricsText.substring(0, 500) + '...');
        } else {
          console.log(`\nFound ${foundMetrics}/${itsmMetrics.length} ITSM metrics`);
        }
        
      } else {
        console.log('Warning: Metrics endpoint returned empty data');
      }
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      console.error('The metrics endpoint is not accessible');
    }
  } catch (error) {
    console.error('Failed to access metrics endpoint:');
    console.error(error.message);
    console.error('\nPlease ensure:');
    console.error('1. The Digital Agency server is running on port 5000');
    console.error('2. The metrics endpoint is properly configured in main.ts');
  }
}

checkMetrics(); 