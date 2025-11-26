import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Paper,
  Chip,
  Button
} from '@mui/material';
import { useAPOD } from '../context/APODContext';
import APODCard from '../components/APODCard';
import GalleryFilters from '../components/GalleryFilters';
import PlanetLoader from '../components/PlanetLoader';
import RefreshIcon from '@mui/icons-material/Refresh';
import PublicIcon from '@mui/icons-material/Public';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Gallery = () => {
  const { galleryAPODs, loading, error, fetchAPODsByDateRange, clearError } = useAPOD();
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    // Load last 7 days by default
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    const endDateStr = endDate.toISOString().split('T')[0];
    const startDateStr = startDate.toISOString().split('T')[0];
    
    fetchAPODsByDateRange(startDateStr, endDateStr);
  }, [fetchAPODsByDateRange]);

  const handleSearch = (startDate, endDate) => {
    setPage(1);
    fetchAPODsByDateRange(startDate, endDate);
  };

  const handleRetry = () => {
    if (galleryAPODs.length > 0) {
      const dates = galleryAPODs.map(apod => apod.date).sort();
      if (dates.length > 0) {
        const startDate = dates[0];
        const endDate = dates[dates.length - 1];
        fetchAPODsByDateRange(startDate, endDate);
      }
    }
  };

  const paginatedAPODs = galleryAPODs.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(galleryAPODs.length / itemsPerPage);

  const getDateRangeInfo = () => {
    if (galleryAPODs.length === 0) return null;
    
    const dates = galleryAPODs.map(apod => apod.date).sort();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return { startDate, endDate, diffDays };
  };

  const dateRangeInfo = getDateRangeInfo();

  return (
    <Box>
      <GalleryFilters onSearch={handleSearch} loading={loading} />

      {error && (
        <Alert 
          severity="error" 
          onClose={clearError} 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <PlanetLoader message="Discovering Cosmic Wonders..." />
      ) : (
        <>
          {galleryAPODs.length > 0 && (
            <Paper sx={{ p: 3, mb: 3, textAlign: 'center', position: 'relative' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, fontFamily: '"Orbitron", sans-serif' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <PublicIcon />
                  COSMIC COLLECTION
                </Box>
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Chip 
                  label={`${galleryAPODs.length} Astronomy Pictures`} 
                  color="primary" 
                  variant="outlined"
                  icon={<PublicIcon />}
                />
                
                {dateRangeInfo && (
                  <>
                    <Chip 
                      label={`${dateRangeInfo.diffDays} days`} 
                      color="secondary" 
                      variant="outlined"
                      icon={<CalendarTodayIcon />}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon fontSize="small" />
                      {dateRangeInfo.startDate} to {dateRangeInfo.endDate}
                    </Typography>
                  </>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
                {[7, 30, 90].map((days) => (
                  <Chip
                    key={days}
                    label={`Last ${days} Days`}
                    onClick={() => {
                      const endDate = new Date();
                      const startDate = new Date();
                      startDate.setDate(endDate.getDate() - (days - 1));
                      
                      const endDateStr = endDate.toISOString().split('T')[0];
                      const startDateStr = startDate.toISOString().split('T')[0];
                      
                      handleSearch(startDateStr, endDateStr);
                    }}
                    variant="outlined"
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Paper>
          )}

          <Grid container spacing={3}>
            {paginatedAPODs.map((apod) => (
              <Grid item xs={12} sm={6} md={4} key={apod.date}>
                <APODCard apod={apod} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {galleryAPODs.length === 0 && !loading && (
            <Box textAlign="center" py={8}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No Astronomy Pictures Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try searching for a different date range or check your connection.
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleSearch(
                  new Date().toISOString().split('T')[0],
                  new Date().toISOString().split('T')[0]
                )}
                startIcon={<RefreshIcon />}
              >
                Load Today's APOD
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Gallery;