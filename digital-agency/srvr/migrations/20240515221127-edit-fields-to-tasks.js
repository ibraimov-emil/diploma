'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Удаляем существующий столбец statusId
    await queryInterface.removeColumn('tasks', 'statusId');

    // Добавляем столбец statusId с новым типом INTEGER
    await queryInterface.addColumn('tasks', 'statusId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },
};
