require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Environment check
console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);

// Middleware
app.use(cors({
  // In production, restrict origins to your frontend domain
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN || '*'
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Root route for Railway
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Click API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message 
  });
});

// Sync database and start server
const startServer = async () => {
  try {
    // Test database connection with retries
    let retries = 5;
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        break;
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw error;
        }
        console.log(`Database connection failed. Retrying in 3 seconds... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // Check if we're running in Railway with the railway script
    // If so, the database was already synced by the seed script
    const skipSync = process.env.RAILWAY === 'true';
    
    if (skipSync) {
      console.log('Skipping database sync as it was already done by the seed script');
    } else {
      // Sync models with database
      await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
      console.log('Database synced successfully');
    }
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Handle shutdown gracefully
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
    
    return server;
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Start server if this file is run directly (not imported)
if (require.main === module) {
  startServer();
}

// Export for testing and bin/www
module.exports = app; 