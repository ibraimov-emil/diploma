import { Sequelize, Model, DataTypes } from 'sequelize';
import * as bcrypt from 'bcryptjs';

// Create a direct Sequelize connection without models
const sequelize = new Sequelize('digital-agency', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: console.log,
});

// Define a simple User model directly (without using the model file)
class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public phone!: string;
  public surname!: string;
  public name!: string;
  public role!: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: true
});

async function createAdminUser() {
  try {
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
    console.error('Unable to create admin user:', error);
  }
}

// Run the function
createAdminUser(); 