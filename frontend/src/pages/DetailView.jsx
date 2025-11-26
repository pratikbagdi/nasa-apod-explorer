import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import { useAPOD } from "../context/APODContext";
import { safeFormatDate } from "../utils/dateUtils";
import MediaDisplay from "../components/MediaDisplay";
import PlanetLoader from "../components/PlanetLoader";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DetailView = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { selectedAPOD, loading, error, fetchAPODByDate, clearError } = useAPOD();

  useEffect(() => {
    if (date) {
      fetchAPODByDate(date);
    }
  }, [date, fetchAPODByDate]);

  if (error) {
    return (
      <Box>
        <Button onClick={() => navigate(-1)} sx={{ mb: 2 }} startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return <PlanetLoader message="Loading cosmic details..." />;
  }

  if (!selectedAPOD) {
    return (
      <Box>
        <Button onClick={() => navigate(-1)} sx={{ mb: 2 }} startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>
        <Alert severity="info">No APOD data found for the selected date.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>
        
        {selectedAPOD.cached && <Chip label="Served from Cache" color="secondary" />}
        {selectedAPOD.isFallback && <Chip label="Sample Data" color="warning" />}
      </Box>

      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <MediaDisplay apod={selectedAPOD} height={600} />

        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", fontFamily: '"Orbitron", sans-serif' }}>
            {selectedAPOD.title || "Untitled"}
          </Typography>

          <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon />
              {safeFormatDate(selectedAPOD.date)}
            </Typography>

            {selectedAPOD.copyright && (
              <Chip label={`© ${selectedAPOD.copyright}`} variant="outlined" />
            )}

            <Chip
              label={selectedAPOD.media_type === "image" ? "Image" : "Video"}
              color="primary"
            />
          </Box>

          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: "1.1rem", mb: 3 }}>
            {selectedAPOD.explanation || "No explanation available."}
          </Typography>

          <Paper sx={{ p: 3, backgroundColor: "background.default" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontFamily: '"Orbitron", sans-serif' }}>
              Technical Details
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "auto 1fr" }, gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Date:
              </Typography>
              <Typography variant="body2">
                {safeFormatDate(selectedAPOD.date, "yyyy-MM-dd")}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Media Type:
              </Typography>
              <Typography variant="body2">{selectedAPOD.media_type}</Typography>

              {selectedAPOD.service_version && (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Service Version:
                  </Typography>
                  <Typography variant="body2">{selectedAPOD.service_version}</Typography>
                </>
              )}
            </Box>
          </Paper>

          {selectedAPOD.isFallback && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <strong>Note:</strong> This is sample content shown due to rate limits or network issues.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DetailView;