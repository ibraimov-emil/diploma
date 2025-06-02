import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSLADefinitions1707144000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, delete any records with NULL metric_name
        await queryRunner.query(`
            DELETE FROM sla_definitions WHERE metric_name IS NULL;
        `);

        // Then, ensure the column is NOT NULL
        await queryRunner.query(`
            ALTER TABLE sla_definitions 
            ALTER COLUMN metric_name SET NOT NULL,
            ALTER COLUMN target_value SET NOT NULL,
            ALTER COLUMN period SET NOT NULL;
        `);

        // Insert default SLA definitions if the table is empty
        await queryRunner.query(`
            INSERT INTO sla_definitions (metric_name, target_value, period, description)
            SELECT 'request_to_project_time', 86400, '24h', 'Time to convert request to project (seconds)'
            WHERE NOT EXISTS (SELECT 1 FROM sla_definitions WHERE metric_name = 'request_to_project_time');

            INSERT INTO sla_definitions (metric_name, target_value, period, description)
            SELECT 'chat_response_time', 900, '15m', 'Time to respond to chat messages (seconds)'
            WHERE NOT EXISTS (SELECT 1 FROM sla_definitions WHERE metric_name = 'chat_response_time');

            INSERT INTO sla_definitions (metric_name, target_value, period, description)
            SELECT 'invoice_payment_time', 259200, '72h', 'Time from invoice to payment (seconds)'
            WHERE NOT EXISTS (SELECT 1 FROM sla_definitions WHERE metric_name = 'invoice_payment_time');

            INSERT INTO sla_definitions (metric_name, target_value, period, description)
            SELECT 'task_completion_rate', 0.9, 'percentage', 'Percentage of tasks completed on time'
            WHERE NOT EXISTS (SELECT 1 FROM sla_definitions WHERE metric_name = 'task_completion_rate');

            INSERT INTO sla_definitions (metric_name, target_value, period, description)
            SELECT 'service_uptime', 0.999, 'percentage', 'Service uptime percentage'
            WHERE NOT EXISTS (SELECT 1 FROM sla_definitions WHERE metric_name = 'service_uptime');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No need to revert the NOT NULL constraints as they should stay
        // Just remove the default SLA definitions
        await queryRunner.query(`
            DELETE FROM sla_definitions 
            WHERE metric_name IN (
                'request_to_project_time',
                'chat_response_time',
                'invoice_payment_time',
                'task_completion_rate',
                'service_uptime'
            );
        `);
    }
} 