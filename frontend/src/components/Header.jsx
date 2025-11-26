import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Tooltip,
  IconButton,
  Switch,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAPOD } from "../context/APODContext";
import TodayIcon from "@mui/icons-material/Today";
import CollectionsIcon from "@mui/icons-material/Collections";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AstronomyIcon from "@mui/icons-material/Stars";
import CacheControls from "./CacheControls";

const Header = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const { cacheInfo, fetchCacheInfo } = useAPOD();

  useEffect(() => {
    fetchCacheInfo();
    const interval = setInterval(fetchCacheInfo, 30000);
    return () => clearInterval(interval);
  }, [fetchCacheInfo]);

  const navItems = [
    { path: "/", label: "Today's APOD", icon: <TodayIcon sx={{ fontSize: 20 }} /> },
    { path: "/gallery", label: "Gallery", icon: <CollectionsIcon sx={{ fontSize: 20 }} /> },
  ];

  const getCacheColor = () => {
    if (!cacheInfo) return "default";
    const usage = (cacheInfo.size / cacheInfo.maxSize) * 100;
    if (usage > 80) return "error";
    if (usage > 60) return "warning";
    return "primary";
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: darkMode 
          ? 'rgba(7, 7, 19, 0.85)'
          : 'rgba(243, 247, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: darkMode
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(160, 160, 255, 0.2)',
        position: 'relative',
        '&::before': darkMode ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(35, 213, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(156, 75, 255, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        } : {},
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: darkMode 
                ? 'linear-gradient(145deg, #23d5ff, #9c4bff)'
                : 'linear-gradient(145deg, #2d3ea8, #7d5cff)',
              mr: 2,
              animation: 'cosmicFloat 3s ease-in-out infinite',
            }}
          >
            <AstronomyIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: "bold",
              fontFamily: '"Orbitron", sans-serif',
              letterSpacing: '0.05em',
              background: darkMode
                ? 'linear-gradient(45deg, #23d5ff, #52ffc3)'
                : 'linear-gradient(45deg, #2d3ea8, #7d5cff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            NASA APOD EXPLORER
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {cacheInfo && (
            <Tooltip title={`Cache Statistics - Hit Rate: ${cacheInfo.hitRate || '0%'}`}>
              <Chip
                label={`Cache: ${cacheInfo.size}/${cacheInfo.maxSize}`}
                size="small"
                color={getCacheColor()}
                variant="outlined"
                sx={{
                  backdropFilter: 'blur(10px)',
                  border: darkMode 
                    ? '1px solid rgba(35, 213, 255, 0.3)'
                    : '1px solid rgba(45, 62, 168, 0.3)',
                  background: darkMode
                    ? 'rgba(35, 213, 255, 0.1)'
                    : 'rgba(45, 62, 168, 0.1)',
                }}
              />
            </Tooltip>
          )}
          <CacheControls />

          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LightModeIcon sx={{ fontSize: 20, color: darkMode ? 'rgba(255,255,255,0.5)' : '#ffb74d' }} />
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                sx={{
                  mx: 1,
                  '& .MuiSwitch-switchBase': {
                    color: darkMode ? '#23d5ff' : '#7d5cff',
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: darkMode ? 'rgba(35, 213, 255, 0.3)' : 'rgba(125, 92, 255, 0.3)',
                  },
                }}
              />
              <DarkModeIcon sx={{ fontSize: 20, color: darkMode ? '#23d5ff' : 'rgba(0,0,0,0.5)' }} />
            </Box>
          </Tooltip>

          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              color="inherit"
              variant={location.pathname === item.path ? "contained" : "outlined"}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "600",
                minWidth: 'auto',
                px: 3,
                fontFamily: '"Orbitron", sans-serif',
                letterSpacing: '0.02em',
                background: location.pathname === item.path 
                  ? (darkMode 
                      ? 'linear-gradient(145deg, #23d5ff, #9c4bff)'
                      : 'linear-gradient(145deg, #2d3ea8, #7d5cff)')
                  : 'transparent',
                border: location.pathname === item.path 
                  ? 'none'
                  : (darkMode 
                      ? '1px solid rgba(35, 213, 255, 0.5)'
                      : '1px solid rgba(45, 62, 168, 0.5)'),
                color: location.pathname === item.path 
                  ? 'white'
                  : (darkMode ? '#23d5ff' : '#2d3ea8'),
                "&:hover": {
                  background: location.pathname === item.path
                    ? (darkMode 
                        ? 'linear-gradient(145deg, #52ffc3, #23d5ff)'
                        : 'linear-gradient(145deg, #7d5cff, #5ad3ff)')
                    : (darkMode 
                        ? 'rgba(35, 213, 255, 0.1)'
                        : 'rgba(45, 62, 168, 0.1)'),
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode 
                    ? '0 0 20px rgba(35, 213, 255, 0.4)'
                    : '0 0 15px rgba(125, 92, 255, 0.3)',
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;