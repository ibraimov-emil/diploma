require('dotenv').config();

module.exports = {
  development: {
    dialect: 'postgres',
    dialectModule: require('pg'),
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'digital-agency',
    autoLoadModels: true,
    synchronize: true,
    logging: false,
  },
  test: {
    dialect: 'postgres',
    dialectModule: require('pg'),
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'digital-agency-test',
    autoLoadModels: true,
    synchronize: true,
    logging: false,
  },
  production: {
    dialect: 'postgres',
    dialectModule: require('pg'),
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'digital-agency',
    autoLoadModels: true,
    synchronize: true,
    logging: false,
  }
}; 