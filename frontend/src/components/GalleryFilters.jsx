import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Chip
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CollectionsIcon from '@mui/icons-material/Collections';
import { format, subDays } from 'date-fns';
import { NASA_APOD_START_DATE, getTodayDateString } from '../utils/dateUtils';

const GalleryFilters = ({ onSearch, loading, darkMode = true }) => {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [localError, setLocalError] = useState('');

  const validateDates = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const today = new Date(getTodayDateString());
    const nasaStartDate = new Date(NASA_APOD_START_DATE);

    setLocalError('');

    if (!start || !end) {
      throw new Error('Both start and end dates are required');
    }

    if (startDateObj > endDateObj) {
      throw new Error('Start date cannot be after end date');
    }

    if (endDateObj > today) {
      throw new Error(`End date cannot be in the future. Today is ${getTodayDateString()}`);
    }

    if (startDateObj < nasaStartDate) {
      throw new Error(`Start date cannot be before ${NASA_APOD_START_DATE}`);
    }

    return true;
  };

  const handleSearch = () => {
    try {
      validateDates(startDate, endDate);
      setLocalError('');
      onSearch(startDate, endDate);
    } catch (error) {
      setLocalError(error.message);
    }
  };

  const handleQuickDateRange = (days) => {
    const newEndDate = new Date();
    const newStartDate = subDays(newEndDate, days - 1);
    
    setStartDate(format(newStartDate, 'yyyy-MM-dd'));
    setEndDate(format(newEndDate, 'yyyy-MM-dd'));
    
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <Paper 
      sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 4,
        background: darkMode
          ? 'linear-gradient(145deg, #0b0f2a, #352c7a)'
          : 'linear-gradient(145deg, #e8efff, #e9e4ff)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: darkMode
          ? '0 8px 32px rgba(0,0,0,0.3)'
          : '0 8px 32px rgba(125, 92, 255, 0.15)',
        border: darkMode
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(160, 160, 255, 0.2)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'radial-gradient(circle at 30% 20%, rgba(35, 213, 255, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 30% 20%, rgba(125, 92, 255, 0.1) 0%, transparent 50%)',
        }
      }}
    >
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 3,
          fontFamily: '"Orbitron", sans-serif',
          letterSpacing: '0.05em',
          background: darkMode
            ? 'linear-gradient(45deg, #23d5ff, #52ffc3, #9c4bff)'
            : 'linear-gradient(45deg, #2d3ea8, #7d5cff, #5ad3ff)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 1,
          fontSize: { xs: '2rem', md: '3rem' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: darkMode 
                ? 'linear-gradient(145deg, #23d5ff, #9c4bff)'
                : 'linear-gradient(145deg, #2d3ea8, #7d5cff)',
              animation: 'cosmicFloat 3s ease-in-out infinite',
            }}
          >
            <CollectionsIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          COSMIC GALLERY
        </Box>
      </Typography>

      <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ 
                shrink: true,
                sx: { 
                  color: 'white', 
                  fontWeight: 600, 
                  fontSize: '1rem',
                  fontFamily: '"Orbitron", sans-serif',
                }
              }}
              inputProps={{
                min: NASA_APOD_START_DATE,
                max: getTodayDateString()
              }}
              error={!!localError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  border: '1px solid rgba(35, 213, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderColor: 'rgba(35, 213, 255, 0.5)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderColor: '#23d5ff',
                    boxShadow: '0 0 0 2px rgba(35, 213, 255, 0.2)'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#23d5ff'
                },
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ 
                shrink: true,
                sx: { 
                  color: 'white', 
                  fontWeight: 600, 
                  fontSize: '1rem',
                  fontFamily: '"Orbitron", sans-serif',
                }
              }}
              inputProps={{
                min: NASA_APOD_START_DATE,
                max: getTodayDateString()
              }}
              error={!!localError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  border: '1px solid rgba(35, 213, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderColor: 'rgba(35, 213, 255, 0.5)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderColor: '#23d5ff',
                    boxShadow: '0 0 0 2px rgba(35, 213, 255, 0.2)'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#23d5ff'
                },
              }}
            />
            <Chip
              label={`${calculateDays()} days`}
              size="small"
              sx={{
                position: 'absolute',
                top: -10,
                right: 10,
                backgroundColor: 'rgba(35, 213, 255, 0.9)',
                color: '#0b0f2a',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                fontFamily: '"Orbitron", sans-serif',
                border: '1px solid rgba(35, 213, 255, 0.5)',
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RocketLaunchIcon />}
              size="large"
              sx={{
                background: 'linear-gradient(145deg, #23d5ff, #9c4bff)',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem',
                fontFamily: '"Orbitron", sans-serif',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 15px rgba(35, 213, 255, 0.4)',
                minWidth: '160px',
                '&:hover': {
                  background: 'linear-gradient(145deg, #52ffc3, #23d5ff)',
                  boxShadow: '0 6px 25px rgba(35, 213, 255, 0.6)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'linear-gradient(45deg, #666, #999)',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? "Exploring..." : "Search Cosmos"}
            </Button>
            
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {[7, 30, 90].map((days) => (
                <Chip
                  key={days}
                  label={`Last ${days} Days`}
                  onClick={() => handleQuickDateRange(days)}
                  disabled={loading}
                  sx={{
                    border: '1px solid rgba(35, 213, 255, 0.5)',
                    color: 'white',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontWeight: 600,
                    fontFamily: '"Orbitron", sans-serif',
                    backgroundColor: 'rgba(35, 213, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#23d5ff',
                      backgroundColor: 'rgba(35, 213, 255, 0.2)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(35, 213, 255, 0.3)'
                    },
                    '&:disabled': {
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'rgba(255,255,255,0.5)',
                      backgroundColor: 'rgba(255,255,255,0.05)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {localError && (
        <Paper 
          sx={{ 
            mt: 2, 
            p: 2, 
            textAlign: 'center',
            backgroundColor: 'rgba(211, 47, 47, 0.9)',
            color: 'white',
            borderRadius: 2,
            position: 'relative',
            zIndex: 1,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Orbitron", sans-serif' }}>
            {localError}
          </Typography>
        </Paper>
      )}

      <Typography 
        variant="body2" 
        sx={{ 
          mt: 2, 
          textAlign: 'center', 
          opacity: 0.9,
          position: 'relative',
          zIndex: 1,
          fontWeight: 500,
          fontFamily: '"Orbitron", sans-serif',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
      >
        <CalendarTodayIcon fontSize="small" />
        Cosmic data available from {NASA_APOD_START_DATE} to {getTodayDateString()}
      </Typography>
    </Paper>
  );
};

export default GalleryFilters;