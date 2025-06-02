import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcessMetricsMigration implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Requests to Projects tracking
        await queryRunner.query(`
            CREATE TABLE request_to_project_tracking (
                id SERIAL PRIMARY KEY,
                request_id INTEGER REFERENCES requests(id),
                project_id INTEGER REFERENCES projects(id),
                request_created_at TIMESTAMP NOT NULL,
                project_created_at TIMESTAMP NOT NULL,
                conversion_time_seconds INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Chat Response Time tracking
        await queryRunner.query(`
            CREATE TABLE chat_response_tracking (
                id SERIAL PRIMARY KEY,
                chat_id INTEGER REFERENCES chats(id),
                message_id INTEGER REFERENCES messages(id),
                sender_id INTEGER REFERENCES users(id),
                employee_id INTEGER REFERENCES employees(id),
                message_sent_at TIMESTAMP NOT NULL,
                response_sent_at TIMESTAMP NOT NULL,
                response_time_seconds INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Invoice Payment tracking
        await queryRunner.query(`
            CREATE TABLE invoice_payment_tracking (
                id SERIAL PRIMARY KEY,
                invoice_id INTEGER REFERENCES invoices(id),
                project_id INTEGER REFERENCES projects(id),
                invoice_created_at TIMESTAMP NOT NULL,
                payment_received_at TIMESTAMP,
                payment_time_seconds INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Task Completion tracking
        await queryRunner.query(`
            CREATE TABLE task_completion_tracking (
                id SERIAL PRIMARY KEY,
                task_id INTEGER REFERENCES tasks(id),
                project_id INTEGER REFERENCES projects(id),
                due_date TIMESTAMP NOT NULL,
                completed_at TIMESTAMP,
                completed_on_time BOOLEAN,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // SLA Definitions
        await queryRunner.query(`
            CREATE TABLE sla_definitions (
                id SERIAL PRIMARY KEY,
                metric_name VARCHAR(100) NOT NULL,
                target_value DECIMAL NOT NULL,
                period VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Insert default SLA definitions
        await queryRunner.query(`
            INSERT INTO sla_definitions (metric_name, target_value, period, description) VALUES
            ('request_to_project_time', 86400, '24h', 'Time to convert request to project (seconds)'),
            ('chat_response_time', 900, '15m', 'Time to respond to chat messages (seconds)'),
            ('invoice_payment_time', 259200, '72h', 'Time from invoice to payment (seconds)'),
            ('task_completion_rate', 0.9, 'percentage', 'Percentage of tasks completed on time'),
            ('service_uptime', 0.999, 'percentage', 'Service uptime percentage');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS task_completion_tracking;`);
        await queryRunner.query(`DROP TABLE IF EXISTS invoice_payment_tracking;`);
        await queryRunner.query(`DROP TABLE IF EXISTS chat_response_tracking;`);
        await queryRunner.query(`DROP TABLE IF EXISTS request_to_project_tracking;`);
        await queryRunner.query(`DROP TABLE IF EXISTS sla_definitions;`);
    }
} 