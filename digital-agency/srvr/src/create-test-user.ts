import { Sequelize } from 'sequelize-typescript';
import { User } from './users/users.model';
import { databaseConfig } from './config/database.config';
import * as bcrypt from 'bcryptjs';

async function createTestUser() {
  const sequelize = new Sequelize({
    dialect: databaseConfig.dialect,
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    models: [User],
  });

  try {
    console.log('Starting database connection...');
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@adm.ru' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
    } else {
      // Create an admin user
      const adminPassword = await bcrypt.hash('12345678', 5);
      
      const adminUser = await User.create({
        email: 'admin@adm.ru',
        password: adminPassword,
        name: 'Admin',
        surname: 'User',
        phone: '+1234567890',
        role: 'admin'
      });
      
      console.log('Admin user created successfully:', adminUser.email);
    }
    
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Unable to create test user:', error);
  }
}

// Run the function
createTestUser(); 