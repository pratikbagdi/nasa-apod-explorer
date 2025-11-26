const express = require('express');
const router = express.Router();
const MemoryCache = require('../services/cache');
const NasaService = require('../services/nasaService');

const cache = new MemoryCache(
  parseInt(process.env.CACHE_TTL) || 3600000,
  parseInt(process.env.CACHE_MAX_SIZE) || 100
);

const nasaService = new NasaService(cache);

const isValidDate = (dateString) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

const isFutureDate = (dateString) => {
  const inputDate = new Date(dateString);
  const today = new Date();
  
  const inputDateStr = inputDate.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];
  
  return inputDateStr > todayStr;
};

const isBeforeAPODStart = (dateString) => {
  const inputDate = new Date(dateString);
  const apodStart = new Date('1995-06-16');
  
  const inputDateStr = inputDate.toISOString().split('T')[0];
  const apodStartStr = apodStart.toISOString().split('T')[0];
  
  return inputDateStr < apodStartStr;
};

router.get('/info', (req, res) => {
  res.json({
    message: 'NASA APOD Explorer API',
    version: '1.0.0',
    endpoints: {
      'GET /apod': 'Get today\'s APOD or date range with query params',
      'GET /apod/:date': 'Get APOD for specific date (YYYY-MM-DD)',
      'GET /apod/cache/info': 'Get cache statistics',
      'DELETE /apod/cache/clear': 'Clear cache',
      'PUT /apod/cache/config': 'Update cache configuration',
      'POST /apod/rate-limit/reset': 'Reset rate limit cooldown (dev)'
    },
    cache: {
      ttl: cache.ttl,
      maxSize: cache.maxSize
    },
    limits: {
      startDate: '1995-06-16'
    }
  });
});

router.get('/', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (start_date && end_date) {
      if (!isValidDate(start_date) || !isValidDate(end_date)) {
        return res.status(400).json({ 
          error: 'Invalid date format. Use YYYY-MM-DD' 
        });
      }
      
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      if (isFutureDate(start_date) || isFutureDate(end_date)) {
        return res.status(400).json({ 
          error: `Dates cannot be in the future. Today is ${todayStr}` 
        });
      }
      
      if (isBeforeAPODStart(start_date) || isBeforeAPODStart(end_date)) {
        return res.status(400).json({ 
          error: 'Dates cannot be before June 16, 1995 (APOD start date)' 
        });
      }

      const start = new Date(start_date + 'T00:00:00');
      const end = new Date(end_date + 'T23:59:59');
      
      if (start > end) {
        return res.status(400).json({ 
          error: 'Start date cannot be after end date' 
        });
      }
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      console.log(`Date range: ${start_date} to ${end_date}, days: ${diffDays}`);
      
      console.log(`No date range restrictions - fetching ${diffDays} days of APOD data`);
      
      const data = await nasaService.getAPODs(start_date, end_date);
      res.json(data);
    } else {
      const data = await nasaService.getAPOD();
      res.json(data);
    }
  } catch (error) {
    console.error('Error in APOD route:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch APOD data',
      message: error.message 
    });
  }
});

router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    if (!isValidDate(date)) {
      return res.status(400).json({ 
        error: 'Invalid date format. Use YYYY-MM-DD' 
      });
    }
    
    if (isFutureDate(date)) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      return res.status(400).json({ 
        error: `Date cannot be in the future. Today is ${todayStr}` 
      });
    }
    
    if (isBeforeAPODStart(date)) {
      return res.status(400).json({ 
        error: 'Date cannot be before June 16, 1995 (APOD start date)' 
      });
    }
    
    const data = await nasaService.getAPOD(date);
    res.json(data);
  } catch (error) {
    console.error('Error in APOD date route:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch APOD data',
      message: error.message 
    });
  }
});

router.get('/cache/info', (req, res) => {
  const stats = cache.getStats();
  res.json({
    size: stats.size,
    maxSize: stats.maxSize,
    ttl: stats.ttl,
    hits: stats.hits,
    misses: stats.misses,
    hitRate: stats.hitRate
  });
});

router.delete('/cache/clear', (req, res) => {
  cache.clear();
  res.json({ 
    message: 'Cache cleared successfully',
    timestamp: new Date().toISOString()
  });
});

router.put('/cache/config', (req, res) => {
  const { ttl, maxSize } = req.body;
  
  if (ttl !== undefined) {
    const newTtl = parseInt(ttl);
    if (isNaN(newTtl) || newTtl < 0) {
      return res.status(400).json({ 
        error: 'TTL must be a positive number' 
      });
    }
    cache.ttl = newTtl;
    console.log(`Cache TTL updated to: ${cache.ttl}ms`);
  }
  
  if (maxSize !== undefined) {
    const newMaxSize = parseInt(maxSize);
    if (isNaN(newMaxSize) || newMaxSize < 1) {
      return res.status(400).json({ 
        error: 'Max size must be at least 1' 
      });
    }
    cache.maxSize = newMaxSize;
    console.log(`Cache max size updated to: ${cache.maxSize}`);
    
    if (cache.size() > cache.maxSize) {
      const excess = cache.size() - cache.maxSize;
      const keys = Array.from(cache.cache.keys()).slice(0, excess);
      keys.forEach(key => cache.delete(key));
    }
  }
  
  res.json({
    message: 'Cache configuration updated successfully',
    ttl: cache.ttl,
    maxSize: cache.maxSize,
    timestamp: new Date().toISOString()
  });
});

let last429Time = 0;
router.post('/rate-limit/reset', (req, res) => {
  last429Time = 0;
  nasaService.consecutiveFailures = 0;
  res.json({ 
    message: 'Rate limit cooldown reset successfully',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;