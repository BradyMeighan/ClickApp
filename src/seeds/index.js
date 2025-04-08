require('dotenv').config();
const sequelize = require('../config/database');
const seedAchievements = require('./achievements');

const runSeeders = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Sync database models (force: true will drop and recreate tables)
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
    
    // Run seeders
    await seedAchievements();
    
    console.log('All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
};

runSeeders(); 