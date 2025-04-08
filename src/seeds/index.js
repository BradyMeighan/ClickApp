require('dotenv').config();
const sequelize = require('../config/database');
const seedAchievements = require('./achievements');

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000; // 3 seconds

// Function to retry database connection
const connectWithRetry = async (attempt = 1) => {
  try {
    console.log(`Attempt ${attempt}/${MAX_RETRIES} - Connecting to database...`);
    await sequelize.authenticate();
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error(`Connection attempt ${attempt} failed:`, error.message);
    
    if (attempt < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(attempt + 1);
    } else {
      console.error('Max retries reached. Could not connect to database.');
      return false;
    }
  }
};

const runSeeders = async () => {
  try {
    // Connect to database with retry
    const connected = await connectWithRetry();
    if (!connected) {
      process.exit(1);
    }
    
    // Check if we're in production environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    // In production, we might not want to force sync (drop tables)
    const syncOptions = isProduction 
      ? { alter: true } // Alter existing tables instead of dropping
      : { force: true }; // Drop and recreate in development
    
    console.log(`Syncing database with options: ${JSON.stringify(syncOptions)}`);
    await sequelize.sync(syncOptions);
    console.log('Database synced successfully');
    
    // Run seeders
    await seedAchievements();
    
    console.log('All seeds completed successfully');
    
    // In Railway, don't exit the process after seeding if running with the railway script
    if (!process.env.RAILWAY) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
};

runSeeders(); 