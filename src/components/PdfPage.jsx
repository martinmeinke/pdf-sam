import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent, CardMedia, Box, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PdfPage = ({ id, index, page, movePage, removePage }) => {
  const ref = useRef(null);
  
  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: 'page',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Set up drop functionality
  const [{ isOver }, drop] = useDrop({
    accept: 'page',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      
      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      
      // Only perform the move when the mouse has crossed half of the items width
      // When dragging to the right, only move when the cursor is after 50%
      // When dragging to the left, only move when the cursor is before 50%
      
      // Dragging right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      
      // Dragging left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      
      // Time to actually perform the action
      movePage(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  // Initialize the refs
  drag(drop(ref));
  
  const cardStyle = {
    opacity: isDragging ? 0.5 : 1,
    border: isOver ? '2px dashed #2196f3' : '1px solid #e0e0e0',
    position: 'relative',
    cursor: 'move',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)',
    transform: isDragging ? 'scale(1.02)' : 'scale(1)',
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      transform: 'translateY(-4px)',
    },
  };

  return (
    <Card 
      ref={ref} 
      sx={cardStyle}
      elevation={isDragging ? 8 : 2}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={page.thumbnail}
          alt={`Page ${page.pageNumber} from ${page.fileName}`}
          sx={{ 
            height: 'auto', 
            objectFit: 'contain',
            maxHeight: '200px',
            bgcolor: '#f8f9fa',
            borderBottom: '1px solid #f0f0f0'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 20%)',
            pointerEvents: 'none'
          }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 5,
            right: 5,
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              color: '#f44336',
            },
            padding: '8px',
            transition: 'all 0.2s ease',
          }}
          onClick={() => removePage(index)}
          size="small"
        >
          <Tooltip title="Delete page">
            <DeleteIcon fontSize="small" />
          </Tooltip>
        </IconButton>
      </Box>
      <CardContent 
        sx={{ 
          p: 1.5, 
          '&:last-child': { pb: 1.5 }, 
          flexGrow: 1,
          borderTop: '1px solid rgba(0,0,0,0.03)',
          bgcolor: 'rgba(247, 250, 252, 0.5)',
        }}
      >
        <Box sx={{ 
          fontSize: '0.75rem',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
        }}>
          <Typography 
            variant="caption" 
            component="span" 
            sx={{ 
              display: 'inline-block',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {page.fileName} - Page {page.pageNumber}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PdfPage;