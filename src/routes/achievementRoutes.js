const express = require('express');
const router = express.Router();
const { User, Achievement, UserAchievement } = require('../models');

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.findAll({
      order: [['id', 'ASC']]
    });
    
    res.json(achievements);
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get achievements for a specific user
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Find user
    const user = await User.findOne({
      where: { walletAddress },
      include: [
        {
          model: Achievement,
          as: 'achievements',
          through: { attributes: ['unlockedAt'] }
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get all achievements
    const allAchievements = await Achievement.findAll();
    
    // Mark unlocked achievements
    const achievements = allAchievements.map(achievement => {
      const unlocked = user.achievements.some(a => a.id === achievement.id);
      const unlockedAchievement = user.achievements.find(a => a.id === achievement.id);
      
      return {
        ...achievement.toJSON(),
        unlocked,
        unlockedAt: unlocked ? unlockedAchievement.UserAchievement.unlockedAt : null
      };
    });
    
    res.json(achievements);
  } catch (error) {
    console.error('Error getting user achievements:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unlock an achievement for a user
router.post('/unlock', async (req, res) => {
  try {
    const { walletAddress, achievementId } = req.body;
    
    if (!walletAddress || !achievementId) {
      return res.status(400).json({ message: 'Wallet address and achievement ID are required' });
    }
    
    // Find user
    const user = await User.findOne({ where: { walletAddress } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find achievement
    const achievement = await Achievement.findByPk(achievementId);
    
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    
    // Check if achievement is already unlocked
    const alreadyUnlocked = await UserAchievement.findOne({
      where: { userId: user.id, achievementId }
    });
    
    if (alreadyUnlocked) {
      return res.status(409).json({ message: 'Achievement already unlocked', achievement });
    }
    
    // Unlock achievement
    await UserAchievement.create({
      userId: user.id,
      achievementId,
      unlockedAt: new Date()
    });
    
    res.status(201).json({
      message: 'Achievement unlocked',
      achievement
    });
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 