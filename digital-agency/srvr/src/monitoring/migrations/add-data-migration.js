'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryRunner, Sequelize) {
    // Добавляем базовые SLA определения, если таблица пуста
    await queryRunner.sequelize.query(`
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
  },

  async down(queryRunner, Sequelize) {
    // Удаляем базовые SLA определения
    await queryRunner.sequelize.query(`
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
}; 