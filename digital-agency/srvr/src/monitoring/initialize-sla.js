// Скрипт для инициализации данных SLA
require('dotenv').config({ path: '.development.env' });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'admin',
  database: process.env.POSTGRES_DB || 'digital-agency',
});

async function initializeSLAData() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('Creating SLA Definitions table if not exists...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS sla_definitions (
        id SERIAL PRIMARY KEY,
        metric_name VARCHAR(255) NOT NULL,
        target_value DECIMAL NOT NULL,
        period VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Checking if SLA data exists...');
    const { rows } = await client.query('SELECT COUNT(*) FROM sla_definitions');
    const count = parseInt(rows[0].count);

    if (count === 0) {
      console.log('No SLA data found. Adding default SLA definitions...');
      await client.query(`
        INSERT INTO sla_definitions (metric_name, target_value, period, description)
        VALUES 
          ('request_to_project_time', 86400, '24h', 'Time to convert request to project (seconds)'),
          ('chat_response_time', 900, '15m', 'Time to respond to chat messages (seconds)'),
          ('invoice_payment_time', 259200, '72h', 'Time from invoice to payment (seconds)'),
          ('task_completion_rate', 0.9, 'percentage', 'Percentage of tasks completed on time'),
          ('service_uptime', 0.999, 'percentage', 'Service uptime percentage');
      `);
      console.log('Default SLA definitions added successfully.');
    } else {
      console.log(`Found ${count} existing SLA definitions.`);
    }

    // Create tracking tables if not exist
    console.log('Creating tracking tables if not exist...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS request_to_project_tracking (
        id SERIAL PRIMARY KEY,
        request_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        request_created_at TIMESTAMP NOT NULL,
        project_created_at TIMESTAMP NOT NULL,
        conversion_time_seconds INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS chat_response_tracking (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER NOT NULL,
        message_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        message_sent_at TIMESTAMP NOT NULL,
        response_sent_at TIMESTAMP NOT NULL,
        response_time_seconds INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS invoice_payment_tracking (
        id SERIAL PRIMARY KEY,
        invoice_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        invoice_created_at TIMESTAMP NOT NULL,
        payment_received_at TIMESTAMP NOT NULL,
        payment_time_seconds INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS task_completion_tracking (
        id SERIAL PRIMARY KEY,
        task_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        due_date TIMESTAMP NOT NULL,
        completed_at TIMESTAMP NOT NULL,
        completed_on_time BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add some demo data
    console.log('Adding demo tracking data...');
    
    // Request to project tracking
    await client.query(`
      INSERT INTO request_to_project_tracking 
        (request_id, project_id, request_created_at, project_created_at, conversion_time_seconds)
      VALUES 
        (1, 1, NOW() - INTERVAL '2 day', NOW() - INTERVAL '1 day', 86400),
        (2, 2, NOW() - INTERVAL '3 day', NOW() - INTERVAL '2 day', 86400)
      ON CONFLICT DO NOTHING;
    `);
    
    // Chat response tracking
    await client.query(`
      INSERT INTO chat_response_tracking 
        (chat_id, message_id, sender_id, employee_id, message_sent_at, response_sent_at, response_time_seconds)
      VALUES 
        (1, 1, 101, 201, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '45 minute', 900),
        (1, 2, 102, 202, NOW() - INTERVAL '2 hour', NOW() - INTERVAL '1 hour 45 minute', 900)
      ON CONFLICT DO NOTHING;
    `);
    
    // Invoice payment tracking
    await client.query(`
      INSERT INTO invoice_payment_tracking 
        (invoice_id, project_id, invoice_created_at, payment_received_at, payment_time_seconds)
      VALUES 
        (1, 1, NOW() - INTERVAL '3 day', NOW() - INTERVAL '1 day', 172800),
        (2, 2, NOW() - INTERVAL '4 day', NOW() - INTERVAL '1 day', 259200)
      ON CONFLICT DO NOTHING;
    `);
    
    // Task completion tracking
    await client.query(`
      INSERT INTO task_completion_tracking 
        (task_id, project_id, due_date, completed_at, completed_on_time)
      VALUES 
        (1, 1, NOW() + INTERVAL '1 day', NOW(), true),
        (2, 1, NOW() - INTERVAL '1 day', NOW(), false),
        (3, 2, NOW() - INTERVAL '2 day', NOW() - INTERVAL '3 day', true),
        (4, 2, NOW() - INTERVAL '1 day', NOW(), true)
      ON CONFLICT DO NOTHING;
    `);

    console.log('Demo data added successfully.');
    await client.release();
    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initializeSLAData(); 