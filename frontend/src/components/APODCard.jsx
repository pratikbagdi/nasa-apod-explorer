import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { safeFormatDate } from '../utils/dateUtils';
import MediaDisplay from './MediaDisplay';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExploreIcon from '@mui/icons-material/Explore';

const APODCard = ({ apod, showDetails = true, height = 320 }) => {
  return (
    <Card
      className="fade-slide-up"
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: '0 0 18px rgba(146, 108, 255, 0.35)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 16,
          padding: '2px',
          background: 'linear-gradient(145deg, #23d5ff, #9c4bff)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        }
      }}
    >
      <MediaDisplay 
        apod={apod} 
        height={height}
        showActions={showDetails}
      />

      {showDetails && (
        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: 3,
          '&:last-child': { pb: 3 },
          background: 'linear-gradient(180deg, transparent, rgba(11, 15, 42, 0.8))'
        }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontWeight: 'bold',
              lineHeight: 1.3,
              minHeight: '2.6em',
              fontFamily: '"Orbitron", sans-serif',
              letterSpacing: '0.02em',
              background: 'linear-gradient(45deg, #23d5ff, #52ffc3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {apod.title || 'Untitled'}
          </Typography>
          
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontFamily: '"Orbitron", sans-serif',
                fontSize: '0.8rem',
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 16 }} />
              {safeFormatDate(apod.date)}
            </Typography>
            
            {apod.media_type === "image" && (
              <Chip 
                label="IMAGE" 
                size="small" 
                sx={{
                  background: 'rgba(35, 213, 255, 0.1)',
                  border: '1px solid rgba(35, 213, 255, 0.3)',
                  fontWeight: 600,
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: '0.7rem',
                  color: '#23d5ff',
                  letterSpacing: '0.05em',
                }}
              />
            )}
            {apod.media_type === "video" && (
              <Chip 
                label="VIDEO" 
                size="small" 
                sx={{
                  background: 'rgba(255, 107, 107, 0.1)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  fontWeight: 600,
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: '0.7rem',
                  color: '#ff6b6b',
                  letterSpacing: '0.05em',
                }}
              />
            )}
          </Box>

          <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to={`/detail/${apod.date}`}
              size="small"
              variant="contained"
              fullWidth
              startIcon={<ExploreIcon />}
              sx={{
                borderRadius: 3,
                py: 1.2,
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 600,
                letterSpacing: '0.02em',
                background: 'linear-gradient(145deg, #23d5ff, #9c4bff)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                '&:hover': {
                  background: 'linear-gradient(145deg, #52ffc3, #23d5ff)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(35, 213, 255, 0.4)',
                }
              }}
            >
              Explore Cosmic View
            </Button>
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

export default APODCard;