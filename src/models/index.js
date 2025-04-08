const sequelize = require('../config/database');
const User = require('./user');
const Click = require('./click');
const Achievement = require('./achievement');
const UserAchievement = require('./userAchievement');

// Define relationships
User.hasMany(Click, { foreignKey: 'userId', as: 'clicks' });
Click.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Achievement, { through: UserAchievement, as: 'achievements' });
Achievement.belongsToMany(User, { through: UserAchievement, as: 'users' });

module.exports = {
  sequelize,
  User,
  Click,
  Achievement,
  UserAchievement
}; 