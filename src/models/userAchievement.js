const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAchievement = sequelize.define('UserAchievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  achievementId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Achievements',
      key: 'id'
    }
  },
  unlockedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = UserAchievement; 