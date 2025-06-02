const { Sequelize, Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Create a direct Sequelize connection without models
const sequelize = new Sequelize('digital-agency', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: console.log,
});

// Define a simple User model directly (without using the model file)
class User extends Model {}

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
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: true
});

async function fixDatabaseSchema() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Check and add columns that might be missing
    const columnsToCheck = [
      { name: 'phone', dataType: 'VARCHAR(255)', defaultValue: "'+1234567890'" },
      { name: 'banned', dataType: 'BOOLEAN', defaultValue: 'false' },
      { name: 'banReason', dataType: 'VARCHAR(255)', defaultValue: 'NULL' },
      { name: 'avatar', dataType: 'VARCHAR(255)', defaultValue: 'NULL' },
      { name: 'happyBirthday', dataType: 'TIMESTAMP', defaultValue: 'NULL' },
      { name: 'refreshToken', dataType: 'TEXT', defaultValue: 'NULL' }
    ];
    
    for (const column of columnsToCheck) {
      // Check if column exists
      const hasColumn = await sequelize.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='${column.name}'`,
        { type: sequelize.QueryTypes.SELECT }
      );
      
      if (hasColumn.length === 0) {
        console.log(`Adding ${column.name} column to users table...`);
        await sequelize.query(
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS "${column.name}" ${column.dataType} DEFAULT ${column.defaultValue}`
        );
        console.log(`${column.name} column added successfully`);
      } else {
        console.log(`${column.name} column already exists`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error fixing database schema:', error);
    return false;
  }
}

async function createTestUsers() {
  try {
    const schemaFixed = await fixDatabaseSchema();
    if (!schemaFixed) {
      console.log('Could not fix schema, aborting user creation');
      return;
    }
    
    // Create list of users to check/create
    const users = [
      { email: 'admin@adm.ru', password: '12345678', name: 'Admin', surname: 'User', role: 'admin' },
      { email: 'nest@dig.ru', password: '12345678', name: 'Test', surname: 'Nest', role: 'admin' }
    ];
    
    for (const userData of users) {
      // Check if user exists
      const existingUser = await sequelize.query(
        `SELECT * FROM users WHERE email = '${userData.email}'`,
        { type: sequelize.QueryTypes.SELECT }
      );
      
      if (existingUser.length > 0) {
        console.log(`User already exists: ${existingUser[0].email}`);
      } else {
        // Create the user
        const hashedPassword = await bcrypt.hash(userData.password, 5);
        
        await sequelize.query(`
          INSERT INTO users (email, password, name, surname, role, phone, banned, "createdAt", "updatedAt") 
          VALUES ('${userData.email}', :password, '${userData.name}', '${userData.surname}', '${userData.role}', '+1234567890', false, NOW(), NOW())
        `, {
          replacements: { password: hashedPassword },
          type: sequelize.QueryTypes.INSERT
        });
        
        console.log(`User created successfully: ${userData.email}`);
      }
    }
    
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Unable to create users:', error);
  }
}

// Run the function
createTestUsers(); 