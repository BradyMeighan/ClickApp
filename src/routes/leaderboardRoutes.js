const express = require('express');
const router = express.Router();
const { User, Achievement, UserAchievement, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get global leaderboard (most clicks)
router.get('/clicks', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const users = await User.findAll({
      attributes: ['walletAddress', 'totalClicks', 'maxCombo', 'maxClicksPerSecond', 'lastActive'],
      order: [['totalClicks', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error getting clicks leaderboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get leaderboard for highest combos
router.get('/combos', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const users = await User.findAll({
      attributes: ['walletAddress', 'maxCombo', 'totalClicks'],
      order: [['maxCombo', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error getting combo leaderboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get leaderboard for clicks per second
router.get('/cps', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const users = await User.findAll({
      attributes: ['walletAddress', 'maxClicksPerSecond', 'totalClicks'],
      order: [['maxClicksPerSecond', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error getting CPS leaderboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get leaderboard for most achievements
router.get('/achievements', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    // Get achievement counts for each user
    const achievementCounts = await UserAchievement.findAll({
      attributes: ['userId', [sequelize.fn('COUNT', sequelize.col('achievementId')), 'achievementCount']],
      group: ['userId'],
      order: [[sequelize.literal('achievementCount'), 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Get user details for each user in the leaderboard
    const userIds = achievementCounts.map(item => item.userId);
    
    const users = await User.findAll({
      attributes: ['id', 'walletAddress', 'totalClicks'],
      where: { id: { [Op.in]: userIds } }
    });
    
    // Combine achievement counts with user details
    const leaderboard = achievementCounts.map(item => {
      const user = users.find(u => u.id === item.userId);
      return {
        walletAddress: user.walletAddress,
        totalClicks: user.totalClicks,
        achievementCount: parseInt(item.get('achievementCount'))
      };
    });
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error getting achievement leaderboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 