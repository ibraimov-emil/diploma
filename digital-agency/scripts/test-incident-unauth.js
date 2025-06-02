const fetch = require('node-fetch');

async function testUnauthorizedAccess() {
  console.log('Testing unauthorized access to incident API...');
  
  try {
    // Try to get all incidents without auth
    console.log('\nAttempting to get all incidents without authentication...');
    const response = await fetch('http://localhost:5000/incidents');
    
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    const data = await response.text();
    console.log('Response body:', data);
    
    // Try to get incident statistics without auth
    console.log('\nAttempting to get incident statistics without authentication...');
    const statsResponse = await fetch('http://localhost:5000/incidents/stats');
    
    console.log('Stats response status:', statsResponse.status);
    console.log('Stats response status text:', statsResponse.statusText);
    
    const statsData = await statsResponse.text();
    console.log('Stats response body:', statsData);
    
  } catch (error) {
    console.error('Error during unauthorized access test:', error.message);
  }
}

testUnauthorizedAccess(); 