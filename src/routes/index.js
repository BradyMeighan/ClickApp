const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const clickRoutes = require('./clickRoutes');
const achievementRoutes = require('./achievementRoutes');
const leaderboardRoutes = require('./leaderboardRoutes');

router.use('/users', userRoutes);
router.use('/clicks', clickRoutes);
router.use('/achievements', achievementRoutes);
router.use('/leaderboard', leaderboardRoutes);

module.exports = router; 