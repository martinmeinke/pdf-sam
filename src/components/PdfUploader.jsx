import React, { useRef } from 'react';
import { Button, Box, Typography, CircularProgress, alpha } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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
        
        // Use FileReader to read the file properly
        const fileArrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
        
        // Create a cloned copy of the file to prevent issues
        const fileBlob = new Blob([new Uint8Array(fileArrayBuffer)], { type: file.type });
        const fileUrl = URL.createObjectURL(fileBlob);
        
        try {
          // Load the PDF document using pdfjs with the URL for preview
          const loadingTask = pdfjs.getDocument({
            url: fileUrl,
            cMapUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/cmaps/',
            cMapPacked: true,
          });
          
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
          
          // To avoid issues with the file object after processing,
          // create a new blob from the source data
          const fileClone = new Blob([new Uint8Array(fileArrayBuffer)], { type: file.type });
          // Convert Blob to File to maintain name property
          const fileObject = new File([fileClone], file.name, { type: file.type });
          
          newPages.push({
            id: `${file.name}-${j}`,
            pageNumber: j + 1,
            fileName: file.name,
            thumbnail,
            // Store the cloned file object 
            file: fileObject,
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
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <Typography variant="h5" gutterBottom color="primary.dark" fontWeight={500}>
        Select PDF Files
      </Typography>
      
      <Box sx={{ 
        width: '100%',
        maxWidth: 500,
        my: 2,
        p: 3, 
        border: '2px dashed',
        borderColor: 'primary.light',
        borderRadius: 2,
        bgcolor: 'rgba(33, 150, 243, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(255, 255, 255, 0.9)'
        }
      }}>
        <PictureAsPdfIcon color="primary" sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Drag & drop PDF files here, or click to select
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
            color="primary"
            size="large"
            sx={{ px: 3, py: 1 }}
          >
            Select PDFs
          </Button>
        </label>
      </Box>
      
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 600 }}>
        Select one or multiple PDF files to arrange or combine pages.
        All processing happens in your browser, files are never uploaded.
      </Typography>
    </Box>
  );
};

export default PdfUploader;