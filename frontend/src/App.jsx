import React, { useState, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Box, keyframes } from "@mui/material";
import { APODProvider } from "./context/APODContext";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import DetailView from "./pages/DetailView";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const cosmicPulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const orbitAnimation = keyframes`
  0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode 
          ? "#070713" 
          : "#f3f7ff",
        paper: darkMode 
          ? "rgba(255, 255, 255, 0.06)" 
          : "rgba(255, 255, 255, 0.45)",
      },
      primary: {
        main: darkMode ? "#23d5ff" : "#2d3ea8",
        light: darkMode ? "#52ffc3" : "#5ad3ff",
        dark: darkMode ? "#9c4bff" : "#7d5cff",
      },
      secondary: {
        main: darkMode ? "#9c4bff" : "#7d5cff",
        light: darkMode ? "#352c7a" : "#e9e4ff",
        dark: darkMode ? "#0b0f2a" : "#e8efff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#0b0f2a",
        secondary: darkMode ? "#b0bec5" : "#546e7a",
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Orbitron", "Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: '0.05em',
      },
      h2: {
        fontFamily: '"Orbitron", "Inter", sans-serif',
        fontWeight: 600,
        letterSpacing: '0.03em',
      },
      h3: {
        fontFamily: '"Orbitron", "Inter", sans-serif',
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
      h4: {
        fontFamily: '"Orbitron", "Inter", sans-serif',
        fontWeight: 600,
        background: darkMode 
          ? "linear-gradient(45deg, #23d5ff, #9c4bff)"
          : "linear-gradient(45deg, #2d3ea8, #7d5cff)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      },
      h5: {
        fontFamily: '"Orbitron", "Inter", sans-serif',
        fontWeight: 500,
      },
      h6: {
        fontWeight: 600,
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 12,
            fontWeight: 600,
            transition: "all 0.3s ease",
            position: 'relative',
            overflow: 'hidden',
            "&::before": {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: darkMode 
                ? 'linear-gradient(90deg, transparent, rgba(35, 213, 255, 0.4), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(125, 92, 255, 0.3), transparent)',
              transition: 'left 0.5s ease',
            },
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: darkMode 
                ? "0 0 14px rgba(35, 213, 255, 0.7)"
                : "0 0 12px rgba(125, 92, 255, 0.4)",
              "&::before": {
                left: '100%',
              }
            }
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            background: darkMode 
              ? "rgba(255, 255, 255, 0.06)" 
              : "rgba(255, 255, 255, 0.45)",
            backdropFilter: darkMode ? "blur(18px)" : "blur(10px)",
            border: darkMode 
              ? "1px solid rgba(255, 255, 255, 0.10)"
              : "1px solid rgba(160, 160, 255, 0.35)",
            boxShadow: darkMode 
              ? "0 0 18px rgba(146, 108, 255, 0.35)"
              : "0 0 14px rgba(125, 92, 255, 0.25)",
            transition: "all 0.3s ease",
            position: 'relative',
            "&::before": {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 16,
              padding: '2px',
              background: darkMode 
                ? 'linear-gradient(145deg, #23d5ff, #9c4bff)'
                : 'linear-gradient(145deg, #7d5cff, #5ad3ff)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            "&:hover": {
              transform: "scale(1.03)",
              "&::before": {
                opacity: 1,
              },
              boxShadow: darkMode 
                ? "0 0 25px rgba(146, 108, 255, 0.5)"
                : "0 0 20px rgba(125, 92, 255, 0.35)",
            }
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode 
              ? "rgba(7, 7, 19, 0.85)" 
              : "rgba(243, 247, 255, 0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: darkMode
              ? "1px solid rgba(255, 255, 255, 0.10)"
              : "1px solid rgba(160, 160, 255, 0.2)",
            boxShadow: "none",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 8,
            backdropFilter: 'blur(10px)',
            background: darkMode
              ? 'rgba(35, 213, 255, 0.1)'
              : 'rgba(45, 62, 168, 0.1)',
            border: darkMode
              ? '1px solid rgba(35, 213, 255, 0.3)'
              : '1px solid rgba(45, 62, 168, 0.2)',
            '&:hover': {
              background: darkMode
                ? 'rgba(35, 213, 255, 0.2)'
                : 'rgba(45, 62, 168, 0.2)',
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(10px)',
          },
        },
      },
    },
    shape: {
      borderRadius: 16,
    },
  }), [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <APODProvider>
        <Box
          sx={{
            minHeight: "100vh",
            background: darkMode 
              ? "linear-gradient(145deg, #0b0f2a, #352c7a)"
              : "linear-gradient(145deg, #e8efff, #e9e4ff)",
            transition: "all 0.5s ease",
            position: 'relative',
            '&::before': darkMode ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 80%, rgba(35, 213, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(156, 75, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(82, 255, 195, 0.05) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
            } : {},
          }}
        >
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/detail/:date" element={<DetailView />} />
            </Routes>
          </Container>
        </Box>
      </APODProvider>
    </ThemeProvider>
  );
}

export default App;