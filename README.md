# PDF Sam - PDF Page Manager

A client-side web application for managing and rearranging PDF pages. Upload multiple PDFs, rearrange or delete pages, and export as a new combined PDF.

## Features

- 📁 Select one or multiple PDF files
- 👁️ Preview all PDF pages
- 🔀 Drag and drop to rearrange pages
- 🗑️ Delete unwanted pages
- 💾 Export as a new combined PDF
- 🔒 Client-side processing (no files are uploaded to a server)

## Technology Stack

- React.js with Vite
- PDF.js for PDF rendering
- PDF-Lib for PDF manipulation
- Material UI for the interface
- React DnD for drag-and-drop functionality

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Usage

1. Click "Select PDFs" to choose one or more PDF files
2. View the thumbnails of all pages
3. Drag and drop to rearrange pages
4. Click the trash icon to delete pages
5. Click "Export PDF" to download the final document

## Privacy

All processing happens locally in your browser. Your PDF files are never uploaded to any server.