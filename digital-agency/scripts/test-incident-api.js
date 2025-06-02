// Script to test incident API directly
const fetch = require('node-fetch');

async function testIncidentAPI() {
  console.log('Testing incident API...');
  
  try {
    // 1. Get all incidents
    console.log('\nGetting all incidents...');
    const allIncidentsResponse = await fetch('http://localhost:5000/incidents');
    
    if (allIncidentsResponse.ok) {
      const incidents = await allIncidentsResponse.json();
      console.log(`Found ${incidents.length} incidents`);
      
      if (incidents.length > 0) {
        console.log('Sample incident:');
        console.log(JSON.stringify(incidents[0], null, 2));
      }
    } else {
      console.log('Failed to get incidents:', allIncidentsResponse.status, allIncidentsResponse.statusText);
    }
    
    // 2. Get incident statistics
    console.log('\nGetting incident statistics...');
    const statsResponse = await fetch('http://localhost:5000/incidents/stats');
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('Incident statistics:');
      console.log(JSON.stringify(stats, null, 2));
    } else {
      console.log('Failed to get incident statistics:', statsResponse.status, statsResponse.statusText);
    }
    
    // 3. Create a new test incident
    console.log('\nCreating a new test incident...');
    const createResponse = await fetch('http://localhost:5000/quality-seed', {
      method: 'POST'
    });
    
    if (createResponse.ok) {
      console.log('Test data created successfully');
      
      // 4. Check updated statistics
      console.log('\nChecking updated statistics...');
      const updatedStatsResponse = await fetch('http://localhost:5000/incidents/stats');
      
      if (updatedStatsResponse.ok) {
        const updatedStats = await updatedStatsResponse.json();
        console.log('Updated incident statistics:');
        console.log(JSON.stringify(updatedStats, null, 2));
      }
    } else {
      console.log('Failed to create test incident:', createResponse.status, createResponse.statusText);
    }
    
    console.log('\nIncident API test completed!');
    
  } catch (error) {
    console.error('Error during incident API test:', error.message);
  }
}

testIncidentAPI(); 