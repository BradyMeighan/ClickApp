const { Achievement } = require('../models');

const seedAchievements = async () => {
  try {
    console.log('Seeding achievements...');
    
    // Delete existing achievements
    await Achievement.destroy({ where: {} });
    
    // These achievements are based on the frontend achievements data
    const achievements = [
      // Click-based achievements
      { id: 1, name: "First Click", description: "Click the button for the first time", threshold: 1, type: "clicks", rarity: "common", icon: "🔘" },
      { id: 2, name: "Clicking Amateur", description: "Reach 10 clicks", threshold: 10, type: "clicks", rarity: "common", icon: "👆" },
      { id: 3, name: "Click Enthusiast", description: "Reach 50 clicks", threshold: 50, type: "clicks", rarity: "uncommon", icon: "✌️" },
      { id: 4, name: "Click Addict", description: "Reach 100 clicks", threshold: 100, type: "clicks", rarity: "uncommon", icon: "👊" },
      { id: 5, name: "Click Master", description: "Reach 250 clicks", threshold: 250, type: "clicks", rarity: "rare", icon: "💯" },
      { id: 6, name: "Click Lord", description: "Reach 500 clicks", threshold: 500, type: "clicks", rarity: "epic", icon: "👑" },
      { id: 7, name: "Click God", description: "Reach 1000 clicks", threshold: 1000, type: "clicks", rarity: "legendary", icon: "⚡" },
      { id: 8, name: "Click Universe", description: "Reach 2500 clicks", threshold: 2500, type: "clicks", rarity: "mythic", icon: "🌌" },
      { id: 9, name: "Click Multiverse", description: "Reach 5000 clicks", threshold: 5000, type: "clicks", rarity: "mythic", icon: "🔮" },
      { id: 10, name: "Click Infinity", description: "Reach 10000 clicks", threshold: 10000, type: "clicks", rarity: "transcendent", icon: "♾️" },
      
      // Combo-based achievements
      { id: 11, name: "Combo Starter", description: "Get a 5x combo", threshold: 5, type: "combo", rarity: "common", icon: "🔄" },
      { id: 12, name: "Combo Builder", description: "Get a 10x combo", threshold: 10, type: "combo", rarity: "uncommon", icon: "⚡" },
      { id: 13, name: "Combo Expert", description: "Get a 25x combo", threshold: 25, type: "combo", rarity: "rare", icon: "🔥" },
      { id: 14, name: "Combo Legend", description: "Get a 50x combo", threshold: 50, type: "combo", rarity: "epic", icon: "💥" },
      { id: 15, name: "Combo King", description: "Get a 100x combo", threshold: 100, type: "combo", rarity: "legendary", icon: "👑" },
      { id: 16, name: "Combo God", description: "Get a 200x combo", threshold: 200, type: "combo", rarity: "mythic", icon: "🌟" },
      { id: 17, name: "Combo Deity", description: "Get a 500x combo", threshold: 500, type: "combo", rarity: "transcendent", icon: "🌠" },
      
      // Level-based achievements
      { id: 18, name: "Level Up", description: "Reach power level 5", threshold: 5, type: "level", rarity: "common", icon: "📈" },
      { id: 19, name: "Power Surge", description: "Reach power level 20", threshold: 20, type: "level", rarity: "rare", icon: "🚀" },
      { id: 20, name: "Maximum Power", description: "Reach power level 50", threshold: 50, type: "level", rarity: "epic", icon: "💫" },
      { id: 21, name: "Transcendent", description: "Reach power level 100", threshold: 100, type: "level", rarity: "legendary", icon: "✨" },
      { id: 22, name: "God Mode", description: "Reach power level 250", threshold: 250, type: "level", rarity: "mythic", icon: "🔱" },
      
      // Speed-based achievements
      { id: 23, name: "Quick Fingers", description: "Achieve 3 clicks per second", threshold: 3, type: "cps", rarity: "uncommon", icon: "⏱️" },
      { id: 24, name: "Lightning Hands", description: "Achieve 5 clicks per second", threshold: 5, type: "cps", rarity: "rare", icon: "⚡" },
      { id: 25, name: "Speed Demon", description: "Achieve 7 clicks per second", threshold: 7, type: "cps", rarity: "epic", icon: "👹" },
      { id: 26, name: "Hyper Clicker", description: "Achieve 10 clicks per second", threshold: 10, type: "cps", rarity: "legendary", icon: "🌪️" },
      { id: 27, name: "Quantum Clicker", description: "Achieve 15 clicks per second", threshold: 15, type: "cps", rarity: "transcendent", icon: "⚛️" },
      
      // Consistency-based achievements
      { id: 28, name: "Minute Madness", description: "Click 100 times in a minute", threshold: 100, type: "minute", rarity: "rare", icon: "⏰" },
      { id: 29, name: "Unstoppable", description: "Click 200 times in a minute", threshold: 200, type: "minute", rarity: "epic", icon: "🔄" },
      { id: 30, name: "Finger Marathon", description: "Click 300 times in a minute", threshold: 300, type: "minute", rarity: "legendary", icon: "🏃" },
      { id: 31, name: "Finger Olympics", description: "Click 500 times in a minute", threshold: 500, type: "minute", rarity: "transcendent", icon: "🏅" },
      
      // Time-based achievements
      { id: 32, name: "Night Owl", description: "Click between 12 AM and 4 AM", threshold: 1, type: "time-night", rarity: "epic", icon: "🦉" },
      { id: 33, name: "Early Bird", description: "Click between 5 AM and 7 AM", threshold: 1, type: "time-morning", rarity: "rare", icon: "🐦" },
      { id: 34, name: "Lunch Break", description: "Click between 12 PM and 1 PM", threshold: 1, type: "time-noon", rarity: "uncommon", icon: "🍱" },
      
      // Session achievements
      { id: 35, name: "Getting Serious", description: "Stay active for 5 minutes", threshold: 5, type: "session", rarity: "uncommon", icon: "⏰" },
      { id: 36, name: "Committed Clicker", description: "Stay active for 15 minutes", threshold: 15, type: "session", rarity: "rare", icon: "⏱️" },
      { id: 37, name: "Dedicated Fan", description: "Stay active for 30 minutes", threshold: 30, type: "session", rarity: "epic", icon: "⏲️" },
      { id: 38, name: "Click Marathon", description: "Stay active for 1 hour", threshold: 60, type: "session", rarity: "legendary", icon: "⌛" },
      
      // Wallet connection achievements
      { id: 39, name: "Connected", description: "Connect your Phantom wallet", threshold: 1, type: "wallet", rarity: "rare", icon: "👛" },
      { id: 40, name: "Solid Balance", description: "Have more than 0.1 SOL in your wallet", threshold: 0.1, type: "wallet-balance", rarity: "epic", icon: "💰" },
      { id: 41, name: "Wealthy Clicker", description: "Have more than 1 SOL in your wallet", threshold: 1, type: "wallet-balance", rarity: "legendary", icon: "💎" },
      { id: 42, name: "SOL Millionaire", description: "Have more than 10 SOL in your wallet", threshold: 10, type: "wallet-balance", rarity: "transcendent", icon: "🏆" },
      
      // Click milestone achievements
      { id: 43, name: "Click Millionaire", description: "Reach 1,000,000 clicks", threshold: 1000000, type: "clicks", rarity: "transcendent", icon: "💎" },
      { id: 44, name: "The Final Click", description: "Reach 10,000,000 clicks", threshold: 10000000, type: "clicks", rarity: "transcendent", icon: "🌌" },
      
      // Anti-spam achievements
      { id: 45, name: "Too Fast!", description: "Trigger the anti-spam system", threshold: 1, type: "antispam", rarity: "uncommon", icon: "🛑" }
    ];
    
    // Create achievements
    await Achievement.bulkCreate(achievements);
    
    console.log(`Seeded ${achievements.length} achievements successfully`);
  } catch (error) {
    console.error('Error seeding achievements:', error);
  }
};

module.exports = seedAchievements; 