import React, { createContext, useContext, useReducer, useCallback } from "react";
import { nasaAPI } from "../services/api";

const APODContext = createContext();

const initialState = {
  todayAPOD: null,
  selectedAPOD: null,
  galleryAPODs: [],
  loading: false,
  error: null,
  cacheInfo: null,
};

const apodReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_TODAY_APOD":
      return { ...state, todayAPOD: action.payload, loading: false, error: null };
    case "SET_SELECTED_APOD":
      return { ...state, selectedAPOD: action.payload, loading: false, error: null };
    case "SET_GALLERY_APODS":
      return { ...state, galleryAPODs: action.payload, loading: false, error: null };
    case "SET_CACHE_INFO":
      return { ...state, cacheInfo: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const APODProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apodReducer, initialState);

  const fetchTodayAPOD = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });
      
      console.log('Fetching today APOD...');
      const response = await nasaAPI.getTodayAPOD();
      
      if (response.data) {
        dispatch({ type: "SET_TODAY_APOD", payload: response.data });
        dispatch({ type: "SET_SELECTED_APOD", payload: response.data });
        console.log('Today APOD fetched successfully');
      } else {
        throw new Error('No data received from server');
      }
      
    } catch (error) {
      console.error('Today APOD fetch error:', error.message);
      dispatch({ type: "SET_ERROR", payload: error.message });
      
      setTimeout(() => {
        console.log('Auto-retrying today APOD...');
        fetchTodayAPOD();
      }, 3000);
    }
  }, []);

  const fetchAPODByDate = useCallback(async (date) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });
      
      console.log(`Fetching APOD for date: ${date}`);
      const response = await nasaAPI.getAPODByDate(date);
      
      if (response.data) {
        dispatch({ type: "SET_SELECTED_APOD", payload: response.data });
        console.log('Date APOD fetched successfully');
      } else {
        throw new Error('No data received from server');
      }
      
    } catch (error) {
      console.error('Date APOD fetch error:', error.message);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }, []);

  const fetchAPODsByDateRange = useCallback(async (startDate, endDate) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });
      
      console.log(`Fetching APODs from ${startDate} to ${endDate}`);
      const response = await nasaAPI.getAPODsByDateRange(startDate, endDate);
      
      let apods = [];
      if (Array.isArray(response.data?.apods)) {
        apods = response.data.apods;
      } else if (Array.isArray(response.data)) {
        apods = response.data;
      } else if (response.data && response.data.date) {
        apods = [response.data];
      }
      
      apods.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      dispatch({ type: "SET_GALLERY_APODS", payload: apods });
      console.log(`Gallery fetched: ${apods.length} items`);
      
    } catch (error) {
      console.error('Gallery fetch error:', error.message);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }, []);

  const fetchCacheInfo = useCallback(async () => {
    try {
      const response = await nasaAPI.getCacheInfo();
      if (response.data) {
        dispatch({ type: "SET_CACHE_INFO", payload: response.data });
      }
    } catch (error) {
      console.error("Failed to fetch cache info:", error);
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const value = {
    ...state,
    fetchTodayAPOD,
    fetchAPODByDate,
    fetchAPODsByDateRange,
    fetchCacheInfo,
    clearError,
  };

  return (
    <APODContext.Provider value={value}>{children}</APODContext.Provider>
  );
};

export const useAPOD = () => {
  const context = useContext(APODContext);
  if (!context) {
    throw new Error("useAPOD must be used within an APODProvider");
  }
  return context;
};