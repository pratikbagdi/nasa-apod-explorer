import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert,
  Paper 
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a1929 0%, #1a237e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}
        >
          <Paper 
            elevation={24}
            sx={{ 
              maxWidth: 600,
              width: '100%',
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              background: 'rgba(19, 47, 76, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Something Went Wrong
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                We encountered an unexpected error while loading the application.
              </Typography>

              {this.state.error && (
                <Box 
                  sx={{ 
                    mt: 2,
                    p: 2,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 1,
                    textAlign: 'left'
                  }}
                >
                  <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
                    Error: {this.state.error.toString()}
                  </Typography>
                </Box>
              )}
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
                size="large"
              >
                Reload Application
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
                size="large"
              >
                Go to Home
              </Button>
            </Box>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 3 }}
            >
              If the problem persists, please check your connection or try again later.
            </Typography>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;