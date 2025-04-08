const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Click = sequelize.define('Click', {
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
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  comboCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  clicksPerSecond: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = Click; 