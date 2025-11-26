import React, { useState } from 'react';
import {
  Box,
  CardMedia,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Typography,
  CircularProgress,
  Tooltip
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ImageIcon from '@mui/icons-material/Image';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import HighQualityIcon from '@mui/icons-material/HighQuality';
import VisibilityIcon from '@mui/icons-material/Visibility';

const MediaDisplay = ({ apod, height = 400, showActions = true }) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleDownload = () => {
    if (apod.media_type === 'image') {
      window.open(apod.hdurl || apod.url, '_blank');
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (apod.media_type === 'image') {
    return (
      <>
        <Box sx={{ position: 'relative', height }}>
          {imageLoading && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(145deg, #0b0f2a, #352c7a)',
                zIndex: 1,
                borderRadius: '16px 16px 0 0',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress 
                  size={40} 
                  sx={{ 
                    color: '#23d5ff',
                    mb: 2 
                  }} 
                />
                <Typography variant="body2" sx={{ color: '#23d5ff', fontFamily: '"Orbitron", sans-serif' }}>
                  Loading Cosmic Image...
                </Typography>
              </Box>
            </Box>
          )}

          {imageError && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(145deg, #0b0f2a, #352c7a)',
                flexDirection: 'column',
                zIndex: 1,
                borderRadius: '16px 16px 0 0',
                gap: 2,
              }}
            >
              <Typography color="#ff6b6b" gutterBottom sx={{ fontFamily: '"Orbitron", sans-serif' }}>
                Failed to load cosmic image
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setImageLoading(true);
                  setImageError(false);
                }}
                sx={{
                  borderColor: '#23d5ff',
                  color: '#23d5ff',
                  '&:hover': {
                    borderColor: '#52ffc3',
                    backgroundColor: 'rgba(82, 255, 195, 0.1)',
                  }
                }}
              >
                Retry
              </Button>
            </Box>
          )}

          <CardMedia
            component="img"
            height={height}
            image={apod.url}
            alt={apod.title}
            sx={{
              objectFit: 'cover',
              backgroundColor: '#000',
              cursor: showActions ? 'pointer' : 'default',
              display: imageLoading || imageError ? 'none' : 'block',
              border: '2px solid transparent',
              background: 'linear-gradient(145deg, #23d5ff, #9c4bff) padding-box, linear-gradient(145deg, #23d5ff, #9c4bff) border-box',
              borderRadius: '16px 16px 0 0',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
            onClick={() => showActions && setImageDialogOpen(true)}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {showActions && !imageLoading && !imageError && (
            <Box sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16, 
              display: 'flex', 
              gap: 1,
              background: 'rgba(11, 15, 42, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              p: 1,
              border: '1px solid rgba(35, 213, 255, 0.3)',
            }}>
              <Tooltip title="Zoom Image" arrow>
                <IconButton
                  onClick={() => setImageDialogOpen(true)}
                  sx={{
                    backgroundColor: 'rgba(35, 213, 255, 0.2)',
                    color: '#23d5ff',
                    border: '1px solid rgba(35, 213, 255, 0.5)',
                    width: 40,
                    height: 40,
                    '&:hover': { 
                      backgroundColor: 'rgba(35, 213, 255, 0.3)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 0 15px rgba(35, 213, 255, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Download HD" arrow>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                  sx={{
                    backgroundColor: 'rgba(156, 75, 255, 0.2)',
                    color: '#9c4bff',
                    border: '1px solid rgba(156, 75, 255, 0.5)',
                    width: 40,
                    height: 40,
                    '&:hover': { 
                      backgroundColor: 'rgba(156, 75, 255, 0.3)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 0 15px rgba(156, 75, 255, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          
          <Chip
            icon={<ImageIcon sx={{ color: '#52ffc3' }} />}
            label="COSMIC IMAGE"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: 'rgba(82, 255, 195, 0.15)',
              color: '#52ffc3',
              fontWeight: 'bold',
              fontFamily: '"Orbitron", sans-serif',
              fontSize: '0.7rem',
              border: '1px solid rgba(82, 255, 195, 0.3)',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.05em',
            }}
          />

          {apod.hdurl && (
            <Chip
              icon={<HighQualityIcon sx={{ color: '#23d5ff' }} />}
              label="HD AVAILABLE"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                background: 'rgba(35, 213, 255, 0.15)',
                color: '#23d5ff',
                fontWeight: 'bold',
                fontFamily: '"Orbitron", sans-serif',
                fontSize: '0.65rem',
                border: '1px solid rgba(35, 213, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                letterSpacing: '0.05em',
              }}
            />
          )}
        </Box>

        <Dialog
          open={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          maxWidth="xl"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(11, 15, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(35, 213, 255, 0.3)',
              borderRadius: 4,
              boxShadow: '0 0 40px rgba(35, 213, 255, 0.4)',
              overflow: 'hidden',
            }
          }}
        >
          <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <IconButton
              onClick={() => setImageDialogOpen(false)}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                backgroundColor: 'rgba(211, 47, 47, 0.2)',
                color: '#ff6b6b',
                border: '1px solid rgba(211, 47, 47, 0.5)',
                width: 40,
                height: 40,
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.3)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 15px rgba(211, 47, 47, 0.5)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ 
              position: 'absolute', 
              left: 16, 
              top: 16, 
              display: 'flex', 
              gap: 1,
              zIndex: 1 
            }}>
              <Tooltip title="Download HD Version" arrow>
                <IconButton
                  onClick={handleDownload}
                  sx={{
                    backgroundColor: 'rgba(156, 75, 255, 0.2)',
                    color: '#9c4bff',
                    border: '1px solid rgba(156, 75, 255, 0.5)',
                    width: 40,
                    height: 40,
                    '&:hover': { 
                      backgroundColor: 'rgba(156, 75, 255, 0.3)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 0 15px rgba(156, 75, 255, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="View Original Size" arrow>
                <IconButton
                  onClick={() => window.open(apod.hdurl || apod.url, '_blank')}
                  sx={{
                    backgroundColor: 'rgba(35, 213, 255, 0.2)',
                    color: '#23d5ff',
                    border: '1px solid rgba(35, 213, 255, 0.5)',
                    width: 40,
                    height: 40,
                    '&:hover': { 
                      backgroundColor: 'rgba(35, 213, 255, 0.3)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 0 15px rgba(35, 213, 255, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography
              variant="h6"
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                background: 'rgba(11, 15, 42, 0.8)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                padding: 2,
                borderRadius: 2,
                border: '1px solid rgba(35, 213, 255, 0.3)',
                fontFamily: '"Orbitron", sans-serif',
                textAlign: 'center',
                zIndex: 1,
              }}
            >
              {apod.title}
            </Typography>

            <img
              src={apod.hdurl || apod.url}
              alt={apod.title}
              style={{ 
                width: '100%', 
                height: 'auto', 
                display: 'block',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'space-between', 
            p: 3, 
            background: 'rgba(11, 15, 42, 0.8)',
            borderTop: '1px solid rgba(35, 213, 255, 0.2)'
          }}>
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              variant="contained"
              sx={{
                background: 'linear-gradient(145deg, #23d5ff, #9c4bff)',
                borderRadius: 3,
                px: 3,
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 600,
                letterSpacing: '0.02em',
                '&:hover': {
                  background: 'linear-gradient(145deg, #52ffc3, #23d5ff)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(35, 213, 255, 0.4)',
                }
              }}
            >
              Download HD
            </Button>
            <Button 
              onClick={() => setImageDialogOpen(false)}
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: 3,
                px: 3,
                fontFamily: '"Orbitron", sans-serif',
                '&:hover': {
                  borderColor: '#23d5ff',
                  backgroundColor: 'rgba(35, 213, 255, 0.1)',
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <Box sx={{ position: 'relative', height }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0b0f2a, #352c7a)',
          cursor: 'pointer',
          position: 'relative',
          borderRadius: '16px 16px 0 0',
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(145deg, #0b0f2a, #352c7a), linear-gradient(145deg, #23d5ff, #9c4bff)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 0 30px rgba(35, 213, 255, 0.3)',
          }
        }}
        onClick={() => window.open(apod.url, '_blank')}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <IconButton
            sx={{
              backgroundColor: 'rgba(255, 0, 0, 0.8)',
              color: 'white',
              width: 80,
              height: 80,
              border: '2px solid rgba(255, 255, 255, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 1)',
                transform: 'scale(1.1)',
                boxShadow: '0 0 25px rgba(255, 0, 0, 0.6)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 40 }} />
          </IconButton>
          <Typography variant="h6" color="white" sx={{ mt: 2, fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif' }}>
            WATCH COSMIC VIDEO
          </Typography>
          <Typography variant="body2" color="white" sx={{ mt: 1, opacity: 0.8 }}>
            Click to explore the video content
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(35, 213, 255, 0.1) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
      </Box>
      
      <Chip
        icon={<VideoCameraBackIcon sx={{ color: '#ff6b6b' }} />}
        label="COSMIC VIDEO"
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          backgroundColor: 'rgba(255, 107, 107, 0.15)',
          color: '#ff6b6b',
          fontWeight: 'bold',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: '0.7rem',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          backdropFilter: 'blur(10px)',
          letterSpacing: '0.05em',
        }}
      />

      <Chip
        label="CLICK TO VIEW"
        size="small"
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          background: 'rgba(35, 213, 255, 0.15)',
          color: '#23d5ff',
          fontWeight: 'bold',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: '0.65rem',
          border: '1px solid rgba(35, 213, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          letterSpacing: '0.05em',
        }}
      />
    </Box>
  );
};

export default MediaDisplay;