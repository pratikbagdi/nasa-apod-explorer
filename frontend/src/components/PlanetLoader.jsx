import React from 'react';
import { Box, Typography } from '@mui/material';

const PlanetLoader = ({ message = "Exploring the cosmos..." }) => {
  return (
    <Box 
      className="cosmic-loading"
      sx={{
        position: 'relative',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}
    >

      <Box 
        className="comet"
        sx={{ animationDelay: '0s', top: '20%', left: '10%' }}
      />
      <Box 
        className="comet"
        sx={{ animationDelay: '1.5s', top: '60%', left: '30%' }}
      />
      <Box 
        className="comet"
        sx={{ animationDelay: '0.7s', top: '80%', left: '70%' }}
      />

      <Box className="planet-loader">
        <Box className="planet" />
        <Box className="moon" />
      </Box>
      
      <Typography 
        variant="h6" 
        sx={{ 
          fontFamily: '"Orbitron", sans-serif',
          background: 'linear-gradient(45deg, #23d5ff, #9c4bff)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textAlign: 'center',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default PlanetLoader;