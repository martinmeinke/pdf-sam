import React from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import PdfPage from './PdfPage';

const PdfPreview = ({ allPages, setAllPages, loading }) => {
  const movePage = (dragIndex, hoverIndex) => {
    // Create a new array with the updated order
    const newPages = [...allPages];
    const draggedPage = newPages[dragIndex];
    
    // Remove the dragged item
    newPages.splice(dragIndex, 1);
    // Insert it at the new position
    newPages.splice(hoverIndex, 0, draggedPage);
    
    setAllPages(newPages);
  };
  
  const removePage = (index) => {
    // Create a new array without the removed page
    const newPages = [...allPages];
    newPages.splice(index, 1);
    setAllPages(newPages);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Processing PDF files...
        </Typography>
      </Box>
    );
  }
  
  if (allPages.length === 0) {
    return (
      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No PDF pages to display. Please select a PDF file.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Pages ({allPages.length})
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Drag pages to reorder. Click the trash icon to delete a page.
      </Typography>
      
      <Grid container spacing={2}>
        {allPages.map((page, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={page.id}>
            <PdfPage
              id={page.id}
              index={index}
              page={page}
              movePage={movePage}
              removePage={removePage}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PdfPreview;