'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // First check if the column exists
    const tableInfo = await queryInterface.describeTable('incidents');
    
    if (!tableInfo.metadata) {
      // Add the metadata column if it doesn't exist
      await queryInterface.addColumn('incidents', 'metadata', {
        type: Sequelize.TEXT,
        allowNull: true
      });
      console.log('Added metadata column to incidents table');
    } else {
      // Modify the column to ensure it's set correctly
      await queryInterface.changeColumn('incidents', 'metadata', {
        type: Sequelize.TEXT,
        allowNull: true
      });
      console.log('Updated metadata column in incidents table');
    }
  },

  async down (queryInterface, Sequelize) {
    // No need to remove the column in down migration as it might be used by other migrations
    // Just log that this migration was reversed
    console.log('Reversed migration fix-incidents-metadata');
  }
}; 