'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('stages', 'paymentId', {
      type: Sequelize.UUID
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('stages', 'paymentId');
  }
};
