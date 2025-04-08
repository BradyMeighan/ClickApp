const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  totalClicks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxCombo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxClicksPerSecond: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  powerLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  longestStreak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  lastActive: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = User; 