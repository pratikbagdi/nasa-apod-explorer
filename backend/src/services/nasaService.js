const axios = require('axios');

const NASA_BASE_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_API_KEY = process.env.NASA_API_KEY;

class NasaService {
  constructor(cache) {
    this.cache = cache;
    this.lastRequestTime = 0;
    this.MIN_REQUEST_INTERVAL = 6000;
    this.requestQueue = [];
    this.isProcessing = false;
    this.consecutiveFailures = 0;
    this.maxConsecutiveFailures = 2;
    
    console.log(`NASA Service initialized`);
    console.log(`Request interval: ${this.MIN_REQUEST_INTERVAL}ms`);
    
    this.validateAPIKey();
  }

  validateAPIKey() {
    if (!NASA_API_KEY) {
      console.error('NASA_API_KEY is missing from environment variables');
      throw new Error('NASA API key not configured');
    }
    
    if (NASA_API_KEY === 'DEMO_KEY' || NASA_API_KEY.length < 20) {
      console.warn('Using demo or invalid API key - rate limits will be strict');
    } else {
      console.log('Valid NASA API key configured');
    }
  }

  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
        const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
        console.log(`Waiting ${waitTime}ms (NASA rate limit protection)`);
        await this.delay(waitTime);
      }
      
      const { params, resolve, reject, retries = 0 } = this.requestQueue.shift();
      
      try {
        console.log(`NASA API Request:`, params);
        
        const startDate = params.start_date;
        const endDate = params.end_date;
        let timeout = 15000;
        
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          
          if (diffDays > 60) timeout = 30000;
          else if (diffDays > 30) timeout = 25000;
          else if (diffDays > 15) timeout = 20000;
        }
        
        const result = await this.makeNASARequest(params, timeout);
        this.lastRequestTime = Date.now();
        this.consecutiveFailures = 0;
        console.log(`Request successful`);
        resolve(result);
      } catch (error) {
        console.error(`Request failed: ${error.message}`);
        this.consecutiveFailures++;
        
        if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
          console.error(`Too many failures, clearing queue`);
          this.requestQueue = [];
          reject(new Error('Service temporarily unavailable. Please try again.'));
          break;
        }
        
        if ((error.message.includes('rate limit') || error.message.includes('429') || error.message.includes('timeout')) && retries < 2) {
          const backoffTime = 10000 * (retries + 1);
          console.log(`Retry ${retries + 1}/2 after ${backoffTime}ms`);
          await this.delay(backoffTime);
          this.requestQueue.unshift({ 
            params, 
            resolve, 
            reject, 
            retries: retries + 1 
          });
        } else {
          reject(error);
        }
      }
    }
    
    this.isProcessing = false;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeNASARequest(params, timeout = 15000) {
    try {
      console.log(`NASA API Call:`, params);
      
      const response = await axios.get(NASA_BASE_URL, {
        params: {
          ...params,
          api_key: NASA_API_KEY
        },
        timeout: timeout,
        headers: {
          'User-Agent': 'NASA-APOD-Explorer/1.0'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('NASA API Error:', {
        status: error.response?.status,
        message: error.message,
        params: params
      });
      
      if (error.response?.status === 429) {
        throw new Error('NASA API rate limit exceeded. Please wait a few seconds.');
      }
      
      if (error.response?.status === 400) {
        throw new Error(`Invalid request: ${error.response.data?.msg || 'Bad request'}`);
      }
      
      if (error.response?.status === 403) {
        throw new Error('Invalid API key or access denied');
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      
      throw new Error(error.response?.data?.msg || 'Failed to fetch from NASA API');
    }
  }

  async queueRequest(params) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ params, resolve, reject });
      this.processQueue();
    });
  }

  generateCacheKey(params) {
    return `apod:${JSON.stringify(params)}`;
  }

  async getAPOD(date = null) {
    try {
      const params = date ? { date } : {};
      const cacheKey = this.generateCacheKey(params);
      
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit: ${cacheKey}`);
        return { ...cachedData, cached: true };
      }

      console.log(`Fetching from NASA: ${cacheKey}`);
      const data = await this.queueRequest(params);
      
      this.cache.set(cacheKey, data);
      
      return { ...data, cached: false };
    } catch (error) {
      console.error(`getAPOD Error: ${error.message}`);
      
      if (error.message.includes('rate limit') || error.message.includes('429') || error.message.includes('Network error')) {
        console.log('Serving fallback data');
        return this.getFallbackAPOD(date);
      }
      
      throw error;
    }
  }

  async getAPODs(startDate, endDate) {
    try {
      const params = { start_date: startDate, end_date: endDate };
      const cacheKey = this.generateCacheKey(params);
      
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for range: ${startDate} to ${endDate}`);
        return { apods: cachedData, cached: true };
      }

      console.log(`Fetching range from NASA: ${startDate} to ${endDate}`);
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      console.log(`Fetching ${diffDays} days of APOD data`);
      
      const data = await this.queueRequest(params);
      
      const apods = Array.isArray(data) ? data : [data];
      
      if (apods.length > 0 && apods.length <= 100) {
        this.cache.set(cacheKey, apods);
      }
      
      return { apods, cached: false };
    } catch (error) {
      console.error(`getAPODs Error: ${error.message}`);
      
      if (error.message.includes('rate limit') || error.message.includes('429') || error.message.includes('Network error') || error.message.includes('timeout')) {
        console.log('Serving fallback data for range');
        return this.getFallbackAPODs(startDate, endDate);
      }
      
      return { 
        apods: [], 
        cached: false, 
        error: error.message 
      };
    }
  }

  getFallbackAPOD(date = null) {
    const today = new Date().toISOString().split('T')[0];
    const targetDate = date || today;
    
    const fallbackData = {
      title: "Exploring Our Universe - NASA Astronomy",
      date: targetDate,
      explanation: "Welcome to NASA's Astronomy Picture of the Day! This feature showcases a different image or photograph of our universe each day, along with a brief explanation written by a professional astronomer. Due to high demand or network issues, we're currently showing sample content. The actual APOD will load automatically when available.",
      url: "https://apod.nasa.gov/apod/image/2401/NGC1232_1024.jpg",
      hdurl: "https://apod.nasa.gov/apod/image/2401/NGC1232_1024.jpg",
      media_type: "image",
      service_version: "v1",
      cached: false,
      isFallback: true
    };
    
    return fallbackData;
  }

  getFallbackAPODs(startDate, endDate) {
    const apods = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    let days = Math.min(Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1, 7);
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      if (currentDate <= today) {
        apods.push(this.getFallbackAPOD(currentDate.toISOString().split('T')[0]));
      }
    }
    
    return { apods, cached: false, isFallback: true };
  }
}

module.exports = NasaService;