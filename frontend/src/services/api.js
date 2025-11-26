import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API response: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`❌ API error:`, error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server is taking too long to respond');
    }
    
    if (error.response?.status === 429) {
      throw new Error('NASA API rate limit exceeded. Please wait 1-2 minutes.');
    }
    
    if (error.response?.status === 400) {
      const serverError = error.response.data?.error;
      if (serverError?.includes('future')) {
        throw new Error('Cannot select future dates. Please select today or a past date.');
      }
      if (serverError?.includes('before June 16, 1995')) {
        throw new Error('APOD data is only available from June 16, 1995 onwards.');
      }
      throw new Error(serverError || 'Invalid request parameters');
    }

    if (error.response?.status === 404) {
      throw new Error('APOD not found for the selected date');
    }

    if (!error.response) {
      throw new Error('Cannot connect to server. Please check if backend is running on port 3001.');
    }

    throw new Error(error.response.data?.error || error.response.data?.message || 'Server error occurred');
  }
);

export const nasaAPI = {
  getTodayAPOD: () => api.get("/apod"),
  getAPODByDate: (date) => api.get(`/apod/${date}`),
  getAPODsByDateRange: (startDate, endDate) =>
    api.get("/apod", { params: { start_date: startDate, end_date: endDate } }),
  
  getCacheInfo: () => api.get("/apod/cache/info"),
  clearCache: () => api.delete("/apod/cache/clear"),
  updateCacheConfig: (config) => api.put("/apod/cache/config", config),
  resetRateLimit: () => api.post("/apod/rate-limit/reset"),
  
  getHealth: () => api.get("/health"),
};

export default api;