'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('service_metrics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uptime: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      mttr: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      mtbf: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      responseTime: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      errorRate: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      requestCount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('service_metrics');
  }
}; 