// Script to test incident automation directly
const fetch = require('node-fetch');

async function testIncidentAutomation() {
  console.log('Testing incident automation...');
  
  try {
    // 1. Create a test incident using the quality-seed endpoint
    console.log('Creating test incidents via quality-seed endpoint...');
    const seedResponse = await fetch('http://localhost:5000/quality-seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!seedResponse.ok) {
      throw new Error(`Failed to seed data: ${seedResponse.status} ${seedResponse.statusText}`);
    }
    
    console.log('Test incidents created successfully!');
    
    // 2. Get metrics to verify
    console.log('\nChecking incident metrics...');
    const metricsResponse = await fetch('http://localhost:9091/metrics');
    
    if (metricsResponse.ok) {
      const metricsText = await metricsResponse.text();
      console.log('Current metrics:');
      console.log(metricsText);
    } else {
      console.log('Could not retrieve metrics:', metricsResponse.status, metricsResponse.statusText);
    }
    
    // 3. Check Prometheus metrics
    console.log('\nChecking Prometheus metrics...');
    const prometheusResponse = await fetch('http://localhost:9090/api/v1/query?query=incident_count');
    
    if (prometheusResponse.ok) {
      const prometheusData = await prometheusResponse.json();
      console.log('Prometheus incident count:');
      console.log(JSON.stringify(prometheusData, null, 2));
    } else {
      console.log('Could not retrieve Prometheus metrics:', prometheusResponse.status, prometheusResponse.statusText);
    }
    
    console.log('\nIncident automation test completed!');
    console.log('Check Grafana dashboard at http://localhost:3000 to see the metrics visualization');
    
  } catch (error) {
    console.error('Error during incident automation test:', error.message);
  }
}

testIncidentAutomation(); 