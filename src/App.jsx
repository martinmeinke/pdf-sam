import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Box, 
  Paper, 
  ThemeProvider, 
  createTheme,
  AppBar,
  Toolbar
} from '@mui/material';
import { alpha } from '@mui/system';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PdfUploader from './components/PdfUploader';
import PdfPreview from './components/PdfPreview';
import PdfExport from './components/PdfExport';
import { pdfjs } from 'react-pdf';

// Configure react-pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Blue
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#ff5722', // Deep orange
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)'
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
        containedPrimary: {
          boxShadow: '0px 4px 8px rgba(33, 150, 243, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          overflow: 'hidden',
        },
      },
    },
  },
});

function App() {
  const [allPages, setAllPages] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <CssBaseline />
        
        <AppBar position="static" elevation={0} color="primary">
          <Toolbar>
            <PictureAsPdfIcon sx={{ mr: 2 }} />
            <Typography variant="h5" component="h1" fontWeight="bold">
              PDF Sam
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 3, pb: 8 }}>
          <Container maxWidth="lg">
            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" component="h2" gutterBottom textAlign="center" color="text.primary">
                PDF Page Manager
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center" gutterBottom>
                Rearrange, combine and edit PDF pages with ease
              </Typography>
            </Box>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider' 
              }}
            >
              <PdfUploader 
                setAllPages={setAllPages} 
                setLoading={setLoading} 
              />
            </Paper>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              <PdfPreview 
                allPages={allPages} 
                setAllPages={setAllPages} 
                loading={loading}
              />
            </Paper>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <PdfExport 
                allPages={allPages} 
                disabled={allPages.length === 0}
              />
            </Paper>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                All processing happens in your browser. Files are never uploaded.
              </Typography>
            </Box>
          </Container>
        </Box>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;