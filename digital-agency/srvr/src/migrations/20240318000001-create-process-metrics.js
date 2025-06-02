'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Requests to Projects tracking
    await queryInterface.createTable('request_to_project_tracking', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      request_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'requests',
          key: 'id'
        }
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projects',
          key: 'id'
        }
      },
      request_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      project_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      conversion_time_seconds: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Chat Response Time tracking
    await queryInterface.createTable('chat_response_tracking', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      chat_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'chats',
          key: 'id'
        }
      },
      message_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'messages',
          key: 'id'
        }
      },
      sender_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'employees',
          key: 'id'
        }
      },
      message_sent_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      response_sent_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      response_time_seconds: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Invoice Payment tracking
    await queryInterface.createTable('invoice_payment_tracking', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'invoices',
          key: 'id'
        }
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projects',
          key: 'id'
        }
      },
      invoice_created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      payment_received_at: {
        type: Sequelize.DATE
      },
      payment_time_seconds: {
        type: Sequelize.INTEGER
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Task Completion tracking
    await queryInterface.createTable('task_completion_tracking', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      task_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tasks',
          key: 'id'
        }
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projects',
          key: 'id'
        }
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      completed_at: {
        type: Sequelize.DATE
      },
      completed_on_time: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // SLA Definitions
    await queryInterface.createTable('sla_definitions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      metric_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      target_value: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      period: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Insert default SLA definitions
    await queryInterface.bulkInsert('sla_definitions', [
      {
        metric_name: 'request_to_project_time',
        target_value: 86400,
        period: '24h',
        description: 'Time to convert request to project (seconds)',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        metric_name: 'chat_response_time',
        target_value: 900,
        period: '15m',
        description: 'Time to respond to chat messages (seconds)',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        metric_name: 'invoice_payment_time',
        target_value: 259200,
        period: '72h',
        description: 'Time from invoice to payment (seconds)',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        metric_name: 'task_completion_rate',
        target_value: 0.9,
        period: 'percentage',
        description: 'Percentage of tasks completed on time',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        metric_name: 'service_uptime',
        target_value: 0.999,
        period: 'percentage',
        description: 'Service uptime percentage',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('task_completion_tracking');
    await queryInterface.dropTable('invoice_payment_tracking');
    await queryInterface.dropTable('chat_response_tracking');
    await queryInterface.dropTable('request_to_project_tracking');
    await queryInterface.dropTable('sla_definitions');
  }
}; 