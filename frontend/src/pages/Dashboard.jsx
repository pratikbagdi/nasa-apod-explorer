import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useAPOD } from "../context/APODContext";
import { Link } from "react-router-dom";
import { safeFormatDate, getTodayDateString, NASA_APOD_START_DATE } from "../utils/dateUtils";
import MediaDisplay from "../components/MediaDisplay";
import PlanetLoader from "../components/PlanetLoader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';
import TodayIcon from '@mui/icons-material/Today';
import ExploreIcon from '@mui/icons-material/Explore';
import CollectionsIcon from '@mui/icons-material/Collections';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const Dashboard = () => {
  const { todayAPOD, selectedAPOD, loading, error, fetchTodayAPOD, fetchAPODByDate, clearError } = useAPOD();
  const [selectedDate, setSelectedDate] = useState(null);
  const apod = selectedAPOD || todayAPOD;

  useEffect(() => {
    if (!todayAPOD && !loading && !selectedDate) {
      fetchTodayAPOD();
    }
  }, [todayAPOD, loading, selectedDate, fetchTodayAPOD]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      if (dateString === getTodayDateString()) {
        fetchTodayAPOD();
      } else {
        fetchAPODByDate(dateString);
      }
    }
  };

  const handleTodayButton = () => {
    setSelectedDate(null);
    clearError();
    fetchTodayAPOD();
  };

  const handleRefresh = () => {
    if (apod?.date) {
      fetchAPODByDate(apod.date);
    } else {
      fetchTodayAPOD();
    }
  };

  const isTodaySelected = !selectedDate;

  if (error) {
    return (
      <Box>
        <Alert severity="error" onClose={clearError} sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleTodayButton}
            startIcon={<RefreshIcon />}
            size="large"
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  if (loading && !apod) {
    return <PlanetLoader message="Exploring the cosmos..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #23d5ff, #9c4bff)',
              animation: 'cosmicFloat 3s ease-in-out infinite',
            }}
          >
            <TodayIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: "bold",
            fontFamily: '"Orbitron", sans-serif',
            letterSpacing: '0.05em',
            background: 'linear-gradient(45deg, #23d5ff, #52ffc3)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>
            ASTRONOMY PICTURE OF THE DAY
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Load Today's APOD">
            <Button
              variant={isTodaySelected ? "contained" : "outlined"}
              startIcon={<TodayIcon />}
              onClick={handleTodayButton}
              disabled={loading}
              size="large"
              sx={{
                borderRadius: 3,
                px: 3,
                fontWeight: 'bold',
                minWidth: '140px',
                fontFamily: '"Orbitron", sans-serif',
              }}
            >
              Today
            </Button>
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
            <CalendarTodayIcon color="primary" />
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              maxDate={new Date()}
              minDate={new Date(NASA_APOD_START_DATE)}
              placeholderText="Select date"
              customInput={
                <TextField
                  size="small"
                  label="Select Date"
                  variant="outlined"
                  fullWidth
                  disabled={loading}
                />
              }
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={30}
              disabled={loading}
            />
          </Box>

          <Tooltip title="Refresh Current APOD">
            <IconButton
              onClick={handleRefresh}
              disabled={loading || !apod}
              color="primary"
              sx={{
                border: '1px solid',
                borderColor: 'primary.main',
                backgroundColor: 'background.paper'
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {apod ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
              <MediaDisplay 
                apod={apod} 
                height={500}
              />
              
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold", flex: 1 }}>
                    {apod.title || "Untitled"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
                    {apod.cached && <Chip label="Cached" color="secondary" size="small" />}
                    {apod.media_type === "image" && (
                      <Chip label="Image" color="primary" size="small" variant="outlined" />
                    )}
                    {apod.media_type === "video" && (
                      <Chip label="Video" color="error" size="small" variant="outlined" />
                    )}
                    {apod.isFallback && <Chip label="Sample" color="warning" size="small" />}
                    {isTodaySelected && <Chip label="Today" color="success" size="small" />}
                  </Box>
                </Box>

                <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon fontSize="small" />
                  {safeFormatDate(apod.date)}
                  {apod.copyright && ` • © ${apod.copyright}`}
                </Typography>

                <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6, fontSize: '1.05rem' }}>
                  {apod.explanation || "No explanation available."}
                </Typography>

                {apod.isFallback && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <strong>Note:</strong> This is sample content. The actual APOD will load automatically when rate limits allow.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: "bold", 
                color: "primary.main",
                fontFamily: '"Orbitron", sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <RocketLaunchIcon />
                QUICK ACTIONS
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/detail/${apod.date}`}
                  fullWidth
                  sx={{ py: 1.5 }}
                  startIcon={<ExploreIcon />}
                >
                  View Full Details
                </Button>

                <Button
                  variant="outlined"
                  component={Link}
                  to="/gallery"
                  fullWidth
                  sx={{ py: 1.5 }}
                  startIcon={<CollectionsIcon />}
                >
                  APOD Gallery
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleTodayButton}
                  disabled={isTodaySelected}
                  fullWidth
                  sx={{ py: 1.5 }}
                  startIcon={<TodayIcon />}
                >
                  Back to Today
                </Button>
              </Box>

              <Box sx={{ mt: 4, p: 2, backgroundColor: 'background.default', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Explore the fascinating world of astronomy through NASA's Astronomy Picture of the Day. 
                  Each day features a different image or photograph of our universe with explanations written by professional astronomers.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Astronomy Picture Available
          </Typography>
          <Button
            variant="contained"
            onClick={handleTodayButton}
            startIcon={<TodayIcon />}
            size="large"
            sx={{ mt: 2 }}
          >
            Load Today's APOD
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;