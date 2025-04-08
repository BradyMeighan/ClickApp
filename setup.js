require('dotenv').config();
const { sequelize } = require('./src/models');
const seedAchievements = require('./src/seeds/achievements');

async function setupDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    console.log('Syncing database models...');
    await sequelize.sync({ force: true });
    console.log('Database models synced successfully');

    console.log('Seeding achievements...');
    await seedAchievements();
    console.log('Database setup completed!');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 