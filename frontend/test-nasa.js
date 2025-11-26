require('dotenv').config();
const axios = require('axios');

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov/planetary/apod';

async function testNASA() {
  console.log('Testing NASA API Key:', NASA_API_KEY ? `Present (${NASA_API_KEY.substring(0, 8)}...)` : 'MISSING!');
  
  try {
    console.log('Testing NASA API connection...');
    
    const response = await axios.get(NASA_BASE_URL, {
      params: {
        api_key: NASA_API_KEY,
        date: '2024-01-01'
      },
      timeout: 10000
    });
    
    console.log('NASA API Test SUCCESS!');
    console.log('Data received:', {
      title: response.data.title,
      date: response.data.date,
      media_type: response.data.media_type
    });
    
  } catch (error) {
    console.error('NASA API Test FAILED:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    if (error.response?.status === 403) {
      console.error('Possible issue: Invalid API Key');
    } else if (error.response?.status === 429) {
      console.error('Issue: Rate limited - wait and try again');
    }
  }
}

testNASA();