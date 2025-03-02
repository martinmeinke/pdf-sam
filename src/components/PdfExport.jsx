import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { PDFDocument } from 'pdf-lib';

const PdfExport = ({ allPages, disabled }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (allPages.length === 0) return;
    
    setExporting(true);
    
    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      
      // Group pages by source file to process more efficiently
      const fileGroups = {};
      
      // Group pages by their source files
      allPages.forEach(page => {
        if (!fileGroups[page.fileName]) {
          fileGroups[page.fileName] = {
            file: page.file,
            pages: []
          };
        }
        fileGroups[page.fileName].pages.push({
          pageNumber: page.pageNumber,
          id: page.id
        });
      });
      
      // Helper function to read a file as array buffer
      const readFileAsArrayBuffer = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      };
      
      const pageMap = {};
      
      // Process each file once rather than each page to avoid loading the same file multiple times
      for (const fileName in fileGroups) {
        try {
          const { file, pages } = fileGroups[fileName];
          
          // Read the file data
          const fileData = await readFileAsArrayBuffer(file);
          
          // Load the source PDF
          const sourcePdf = await PDFDocument.load(fileData, {
            // Handle password protection in pdf-lib
            ignoreEncryption: false,
          }).catch(error => {
            // Check for typical encryption-related errors
            if (error.message.includes('encrypted') || 
                error.message.includes('password') || 
                error.message.toLowerCase().includes('decrypt')) {
              throw new Error(`The file "${fileName}" is password protected and cannot be processed.`);
            }
            throw error;
          });
          
          // Get the indices of pages to copy (PDF-Lib uses 0-based indexing)
          const pageIndices = pages.map(p => p.pageNumber - 1);
          
          // Copy all needed pages from this file at once
          const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices);
          
          // Map the page IDs to the copied pages
          copiedPages.forEach((copiedPage, i) => {
            pageMap[pages[i].id] = copiedPage;
          });
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error);
        }
      }
      
      // Now add all pages to the merged PDF in the correct order
      for (const page of allPages) {
        if (pageMap[page.id]) {
          mergedPdf.addPage(pageMap[page.id]);
        }
      }
      
      // Serialize the merged PDF to bytes
      const mergedPdfBytes = await mergedPdf.save();
      
      // Create a blob from the PDF bytes
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      
      // Create a download link for the blob
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      // Create a filename with the current date and time
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 19).replace(/[-T:]/g, '');
      link.download = `merged_pdf_${dateStr}.pdf`;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleExport}
        disabled={disabled || exporting}
        startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ minWidth: '150px' }}
      >
        {exporting ? 'Exporting...' : 'Export PDF'}
      </Button>
      
      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
        {disabled 
          ? 'Add PDF pages to create an export'
          : `Export ${allPages.length} page${allPages.length !== 1 ? 's' : ''} as a single PDF`
        }
      </Typography>
    </Box>
  );
};

export default PdfExport;