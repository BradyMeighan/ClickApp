const express = require('express');
const router = express.Router();
const { User, Achievement } = require('../models');

// Get user by wallet address
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
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
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or update user
router.post('/', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
    
    // Check if user exists
    let user = await User.findOne({ where: { walletAddress } });
    
    if (user) {
      // Update last active timestamp
      user.lastActive = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        walletAddress,
        lastActive: new Date()
      });
    }
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user stats
router.put('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { totalClicks, maxCombo, maxClicksPerSecond, powerLevel, longestStreak } = req.body;
    
    const user = await User.findOne({ where: { walletAddress } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user stats
    if (totalClicks !== undefined) user.totalClicks = totalClicks;
    if (maxCombo !== undefined && maxCombo > user.maxCombo) user.maxCombo = maxCombo;
    if (maxClicksPerSecond !== undefined && maxClicksPerSecond > user.maxClicksPerSecond) user.maxClicksPerSecond = maxClicksPerSecond;
    if (powerLevel !== undefined) user.powerLevel = powerLevel;
    if (longestStreak !== undefined && longestStreak > user.longestStreak) user.longestStreak = longestStreak;
    
    user.lastActive = new Date();
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 