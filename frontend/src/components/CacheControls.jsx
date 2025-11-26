import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Alert,
  Divider,
  Stack,
  Slider,
  InputAdornment
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CachedIcon from '@mui/icons-material/Cached';
import TimerIcon from '@mui/icons-material/Timer';
import StorageIcon from '@mui/icons-material/Storage';
import { useAPOD } from '../context/APODContext';
import { nasaAPI } from '../services/api';

const CacheControls = () => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState({
    ttl: 60,
    maxSize: 100
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { cacheInfo, fetchCacheInfo } = useAPOD();

  const handleOpen = () => {
    if (cacheInfo) {
      setConfig({
        ttl: Math.round(cacheInfo.ttl / 60000),
        maxSize: cacheInfo.maxSize
      });
    }
    setOpen(true);
    setMessage('');
  };

  const handleClose = () => {
    setOpen(false);
    setMessage('');
  };

  const handleClearCache = async () => {
    setLoading(true);
    try {
      await nasaAPI.clearCache();
      setMessage('Cache cleared successfully');
      fetchCacheInfo();
    } catch (error) {
      setMessage('Failed to clear cache: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async () => {
    setLoading(true);
    try {
      await nasaAPI.updateCacheConfig({
        ttl: config.ttl * 60000,
        maxSize: config.maxSize
      });
      setMessage('Cache configuration updated');
      fetchCacheInfo();
    } catch (error) {
      setMessage('Failed to update configuration: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetRateLimit = async () => {
    setLoading(true);
    try {
      await nasaAPI.resetRateLimit();
      setMessage('Rate limit cooldown reset');
    } catch (error) {
      setMessage('Failed to reset rate limit: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTtlChange = (event, newValue) => {
    setConfig(prev => ({ ...prev, ttl: newValue }));
  };

  const handleMaxSizeChange = (event) => {
    const value = Math.max(1, parseInt(event.target.value) || 1);
    setConfig(prev => ({ ...prev, maxSize: value }));
  };

  return (
    <>
      <Button
        startIcon={<SettingsIcon />}
        onClick={handleOpen}
        color="inherit"
        variant="outlined"
        size="small"
        sx={{ minWidth: 'auto' }}
      >
        Cache
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CachedIcon color="primary" />
            <Typography variant="h6" component="span">
              Cache Management
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          {message && (
            <Alert 
              severity={message.includes('✅') ? 'success' : 'error'} 
              sx={{ mb: 2 }}
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          )}

          {cacheInfo && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorageIcon fontSize="small" />
                Cache Statistics
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label={`Size: ${cacheInfo.size}/${cacheInfo.maxSize}`} 
                  color="primary" 
                  variant="outlined" 
                  size="small"
                />
                <Chip 
                  label={`Hit Rate: ${cacheInfo.hitRate || '0%'}`} 
                  color="secondary" 
                  variant="outlined" 
                  size="small"
                />
                <Chip 
                  label={`TTL: ${Math.round(cacheInfo.ttl / 60000)}min`} 
                  variant="outlined" 
                  size="small"
                />
              </Stack>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Performance:
                </Typography>
                <Chip 
                  label={parseFloat(cacheInfo.hitRate) > 50 ? "Good" : "Needs Improvement"} 
                  color={parseFloat(cacheInfo.hitRate) > 50 ? "success" : "warning"}
                  size="small"
                />
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon fontSize="small" />
              Cache Configuration
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>
                Time to Live (TTL): {config.ttl} minutes
              </Typography>
              <Slider
                value={config.ttl}
                onChange={handleTtlChange}
                min={1}
                max={120}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} min`}
                disabled={loading}
              />
            </Box>

            <TextField
              label="Maximum Cache Size"
              type="number"
              value={config.maxSize}
              onChange={handleMaxSizeChange}
              fullWidth
              size="small"
              disabled={loading}
              InputProps={{
                endAdornment: <InputAdornment position="end">items</InputAdornment>,
              }}
              helperText="Maximum number of APODs to cache"
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleUpdateConfig}
            disabled={loading}
            fullWidth
            sx={{ mb: 1 }}
          >
            {loading ? 'Updating...' : 'Update Cache Configuration'}
          </Button>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleClearCache}
              disabled={loading}
              size="small"
            >
              Clear Cache
            </Button>
            
            <Button
              variant="outlined"
              color="info"
              onClick={handleResetRateLimit}
              disabled={loading}
              size="small"
            >
              Reset Rate Limit
            </Button>
          </Box>
          
          <Button onClick={handleClose} disabled={loading}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CacheControls;