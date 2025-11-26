require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const apodRoutes = require('./routes/apod');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://nasa-apod-explorer-sepia.vercel.app',
    'https://nasa-apod-explorer-backend.vercel.app'
  ],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(express.json());

app.use('/apod', apodRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'NASA APOD Explorer API',
    version: '1.0.0',
    endpoints: {
      'GET /apod': 'Get today\'s APOD or date range',
      'GET /apod/:date': 'Get APOD for specific date',
      'GET /apod/cache/info': 'Cache statistics',
      'DELETE /apod/cache/clear': 'Clear cache',
      'PUT /apod/cache/config': 'Update cache config'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

app.listen(PORT, () => {
  console.log(`NASA APOD Backend running on port ${PORT}`);
  console.log(`Using NASA API Key: ${process.env.NASA_API_KEY ? 'Present' : 'MISSING!'}`);
  console.log(`Cache TTL: ${process.env.CACHE_TTL}ms, Max Size: ${process.env.CACHE_MAX_SIZE}`);
  console.log(`API available at: http://localhost:${PORT}/apod`);

});

