const fetch = require('node-fetch');
const apiUrl = 'http://localhost:5000/quality-seed';

async function generateTestData() {
  console.log('Generating test data for ITSM metrics...');
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      // Try to parse as JSON first, but fall back to text if that fails
      try {
        const result = await response.json();
        console.log('Test data generation successful!');
        console.log(result);
      } catch (jsonError) {
        const textResult = await response.text();
        console.log('Test data generation successful!');
        console.log(textResult);
      }
      console.log('\nMetrics should now be visible in Grafana at http://localhost:3000');
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      console.error('Make sure the server is running at http://localhost:5000');
    }
  } catch (error) {
    console.error('Failed to generate test data:');
    console.error(error.message);
    console.error('\nPlease ensure:');
    console.error('1. The Digital Agency server is running on port 5000');
    console.error('2. The Prometheus and Grafana containers are running');
  }
}

generateTestData(); 