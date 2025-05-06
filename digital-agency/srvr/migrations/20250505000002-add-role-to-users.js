'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Check if the column already exists
      try {
        const tableInfo = await queryInterface.describeTable('users');
        
        if (!tableInfo.role) {
          // First add the column allowing null values
          await queryInterface.addColumn('users', 'role', {
            type: Sequelize.STRING,
            allowNull: true
          });
          
          // Update existing rows with a default value
          await queryInterface.sequelize.query(`
            UPDATE "users" SET "role" = 'user' WHERE "role" IS NULL
          `);
          
          // Then make it not null
          await queryInterface.changeColumn('users', 'role', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'user'
          });
          
          console.log('Role column added to users table and existing rows updated');
        } else {
          console.log('Role column already exists in users table');
        }
      } catch (error) {
        // If the table doesn't exist yet, no need to do anything
        console.log('Users table does not exist yet:', error.message);
      }
    } catch (error) {
      console.error('Error adding role column to users table:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove the role column if table exists
      try {
        const tableInfo = await queryInterface.describeTable('users');
        if (tableInfo.role) {
          await queryInterface.removeColumn('users', 'role');
          console.log('Role column removed from users table');
        }
      } catch (error) {
        console.log('Users table does not exist, nothing to remove');
      }
    } catch (error) {
      console.error('Error removing role column from users table:', error);
      throw error;
    }
  }
}; 