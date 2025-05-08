'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tasks', 'projectId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'projects',
        key: 'id'
      },
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tasks', 'projectId');
  }
}; 