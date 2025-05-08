const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const GRAFANA_URL = 'http://localhost:3000';
const GRAFANA_USER = 'admin';
const GRAFANA_PASSWORD = 'admin';

async function importDashboard() {
    console.log('Importing Process Metrics Dashboard to Grafana...');

    try {
        // Read dashboard JSON
        const dashboardPath = path.join(__dirname, '../prometheus/process-metrics-dashboard.json');
        const dashboardJson = fs.readFileSync(dashboardPath, 'utf8');

        // Get Grafana API key
        const authResponse = await fetch(`${GRAFANA_URL}/api/auth/keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Process Metrics Import',
                role: 'Admin',
            }),
            auth: {
                username: GRAFANA_USER,
                password: GRAFANA_PASSWORD,
            },
        });

        if (!authResponse.ok) {
            throw new Error(`Failed to get API key: ${authResponse.statusText}`);
        }

        const { key } = await authResponse.json();

        // Import dashboard
        const importResponse = await fetch(`${GRAFANA_URL}/api/dashboards/db`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`,
            },
            body: JSON.stringify({
                dashboard: JSON.parse(dashboardJson),
                overwrite: true,
            }),
        });

        if (!importResponse.ok) {
            throw new Error(`Failed to import dashboard: ${importResponse.statusText}`);
        }

        console.log('Dashboard imported successfully!');
        console.log('You can now access it at:');
        console.log(`${GRAFANA_URL}/d/process-metrics/process-metrics-dashboard`);

    } catch (error) {
        console.error('Error importing dashboard:');
        console.error(error.message);
        console.error('\nPlease ensure:');
        console.error('1. Grafana is running at http://localhost:3000');
        console.error('2. Default credentials (admin/admin) are working');
        console.error('3. Prometheus data source is configured in Grafana');
    }
}

importDashboard(); 