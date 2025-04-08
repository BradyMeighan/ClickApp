const express = require('express');
const router = express.Router();
const { User, Click } = require('../models');

// Record a new click
router.post('/', async (req, res) => {
  try {
    const { walletAddress, comboCount, clicksPerSecond } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
    
    // Find or create user
    let user = await User.findOne({ where: { walletAddress } });
    
    if (!user) {
      user = await User.create({
        walletAddress,
        totalClicks: 0,
        lastActive: new Date()
      });
    }
    
    // Create click record
    const click = await Click.create({
      userId: user.id,
      timestamp: new Date(),
      comboCount: comboCount || 0,
      clicksPerSecond: clicksPerSecond || 0
    });
    
    // Update user's total clicks
    user.totalClicks += 1;
    
    // Update max combo if needed
    if (comboCount && comboCount > user.maxCombo) {
      user.maxCombo = comboCount;
    }
    
    // Update max CPS if needed
    if (clicksPerSecond && clicksPerSecond > user.maxClicksPerSecond) {
      user.maxClicksPerSecond = clicksPerSecond;
    }
    
    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();
    
    res.status(201).json({
      click,
      user: {
        totalClicks: user.totalClicks,
        maxCombo: user.maxCombo,
        maxClicksPerSecond: user.maxClicksPerSecond
      }
    });
  } catch (error) {
    console.error('Error recording click:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get click history for a user
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    
    // Find user
    const user = await User.findOne({ where: { walletAddress } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get click history
    const clicks = await Click.findAndCountAll({
      where: { userId: user.id },
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      total: clicks.count,
      clicks: clicks.rows
    });
  } catch (error) {
    console.error('Error getting click history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 