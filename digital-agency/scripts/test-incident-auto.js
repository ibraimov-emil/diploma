const fetch = require('node-fetch');

async function testAutomaticIncidentRegistration() {
    console.log('Testing automatic incident registration for system failures...\n');

    try {
        // 1. Simulate system failure by making invalid requests
        console.log('1. Simulating system failures...');
        
        // Simulate database connection failure
        console.log('\nSimulating database connection failure...');
        const dbFailureResponse = await fetch('http://localhost:5000/api/health/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'simulate_failure' })
        });
        console.log('Database failure simulation response:', await dbFailureResponse.text());

        // Simulate API endpoint failure
        console.log('\nSimulating API endpoint failure...');
        const apiFailureResponse = await fetch('http://localhost:5000/api/health/endpoint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: '/api/critical', action: 'simulate_failure' })
        });
        console.log('API failure simulation response:', await apiFailureResponse.text());

        // 2. Check if incidents were automatically created
        console.log('\n2. Checking for automatically created incidents...');
        const incidentsResponse = await fetch('http://localhost:5000/incidents');
        const incidents = await incidentsResponse.json();
        
        // Filter recent incidents (last 5 minutes)
        const recentIncidents = incidents.filter(inc => {
            const incidentTime = new Date(inc.registeredAt);
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            return incidentTime > fiveMinutesAgo;
        });

        console.log('\nRecently created incidents:');
        recentIncidents.forEach(inc => {
            console.log(`\nIncident ID: ${inc.id}`);
            console.log(`Title: ${inc.title}`);
            console.log(`Description: ${inc.description}`);
            console.log(`Severity: ${inc.severity}`);
            console.log(`Status: ${inc.status}`);
            console.log(`Registered at: ${inc.registeredAt}`);
        });

        // 3. Verify incident metrics
        console.log('\n3. Checking incident metrics...');
        const metricsResponse = await fetch('http://localhost:5000/incidents/stats');
        const metrics = await metricsResponse.json();
        
        console.log('\nCurrent metrics:');
        console.log(`Total incidents: ${metrics.total}`);
        console.log(`Open incidents: ${metrics.open}`);
        console.log(`High severity: ${metrics.highSeverity}`);
        console.log(`Medium severity: ${metrics.mediumSeverity}`);
        console.log(`Low severity: ${metrics.lowSeverity}`);
        console.log(`MTTR: ${metrics.mttr} minutes`);

        // 4. Check Grafana integration
        console.log('\n4. Verifying Grafana integration...');
        const grafanaResponse = await fetch('http://localhost:3000/api/health');
        console.log('Grafana health check:', await grafanaResponse.text());

    } catch (error) {
        console.error('Error during automatic incident registration test:', error.message);
    }
}

testAutomaticIncidentRegistration(); 