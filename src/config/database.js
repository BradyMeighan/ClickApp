const { Sequelize } = require('sequelize');

// Add fallback and error handling for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set!');
  if (process.env.NODE_ENV === 'production') {
    console.error('This is a critical error in production mode.');
    process.exit(1);
  } else {
    console.warn('Using default local database connection for development.');
  }
}

// Log the database URL (without password) for debugging
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/click_db';
const maskedUrl = databaseUrl.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
console.log(`Connecting to database: ${maskedUrl}`);

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /TimeoutError/
    ],
    max: 3
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

module.exports = sequelize; 