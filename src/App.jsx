import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import PdfUploader from './components/PdfUploader';
import PdfPreview from './components/PdfPreview';
import PdfExport from './components/PdfExport';
import { pdfjs } from 'react-pdf';

// Configure react-pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  const [allPages, setAllPages] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            PDF Page Manager
          </Typography>
          
          <PdfUploader 
            setAllPages={setAllPages} 
            setLoading={setLoading} 
          />

          <PdfPreview 
            allPages={allPages} 
            setAllPages={setAllPages} 
            loading={loading}
          />

          <PdfExport 
            allPages={allPages} 
            disabled={allPages.length === 0}
          />
        </Box>
      </Container>
    </DndProvider>
  );
}

export default App;