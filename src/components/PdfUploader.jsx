import React, { useRef } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';

const PdfUploader = ({ setAllPages, setLoading }) => {
  const fileInputRef = useRef();

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const newPages = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // For PDF.js, we'll use a Blob URL which doesn't detach the ArrayBuffer
        const fileUrl = URL.createObjectURL(file);
        
        try {
          // Load the PDF document using pdfjs with the URL for preview
          const loadingTask = pdfjs.getDocument(fileUrl);
          
          // Check for password protection
          loadingTask.onPassword = (updatePassword, reason) => {
            // If we detect the PDF is password protected, throw an error
            URL.revokeObjectURL(fileUrl);
            throw new Error(`The file "${file.name}" is password protected and cannot be processed.`);
          };
          
          const pdf = await loadingTask.promise;
          
          // Process each page
          for (let j = 0; j < pdf.numPages; j++) {
          const page = await pdf.getPage(j + 1);
          const viewport = page.getViewport({ scale: 1.0 });
          
          // Create a canvas to render the page for preview
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          // Convert canvas to data URL for preview
          const thumbnail = canvas.toDataURL('image/png');
          
          newPages.push({
            id: `${file.name}-${j}`,
            pageNumber: j + 1,
            fileName: file.name,
            thumbnail,
            // Store the actual file object instead of the ArrayBuffer
            file: file,
            width: viewport.width,
            height: viewport.height,
          });
        }
        
        // Clean up the URL
        URL.revokeObjectURL(fileUrl);
        } catch (error) {
          // Handle password errors from this specific file
          console.error(`Error processing file "${file.name}":`, error);
          alert(error.message || `Error processing file "${file.name}". It may be password protected or corrupted.`);
          
          // Clean up the URL in case of error
          URL.revokeObjectURL(fileUrl);
        }
      }
      
      setAllPages(prevPages => [...prevPages, ...newPages]);
    } catch (error) {
      console.error('Error processing PDF files:', error);
      alert('Error processing PDF files. Please try again.');
    } finally {
      setLoading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <Box sx={{ mb: 3, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Select PDF Files
      </Typography>
      <input
        ref={fileInputRef}
        accept="application/pdf"
        style={{ display: 'none' }}
        id="pdf-file-input"
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <label htmlFor="pdf-file-input">
        <Button 
          variant="contained" 
          component="span"
        >
          Select PDFs
        </Button>
      </label>
      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
        Select one or multiple PDF files to arrange or combine pages
      </Typography>
    </Box>
  );
};

export default PdfUploader;