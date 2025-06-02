'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quality_service_metrics', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('quality_service_metrics');
  }
}; 