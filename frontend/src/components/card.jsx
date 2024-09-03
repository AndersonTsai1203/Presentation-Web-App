import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

const PresentationCard = ({ title, thumbnail, description, slides }) => {
  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 'auto',
      aspectRatio: '2 / 1',
      mb: 1,
    }}>
      <Typography variant="h6" component="div" sx={{ padding: 2 }}>
        {title}
      </Typography>
      <Box sx={{
        width: '100%',
        height: '200px',
        // Grey background if no thumbnail
        backgroundColor: thumbnail ? 'transparent' : '#ccc',
        backgroundImage: thumbnail ? `url(${thumbnail})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
      <CardContent>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        <Typography variant="body2">
          Slides: {Object.keys(slides).length}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PresentationCard;
