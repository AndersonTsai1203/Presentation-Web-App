import React from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import Header from '../components/header';
import { Box, CssBaseline, Grid, Button, Typography, Card, CardContent } from '@mui/material';

function RearrangingSlides (props) {
  const { id } = useParams();
  const navigate = useNavigate();
  if (props.token === null) {
    return <Navigate to='/login' />;
  }

  // TODO: Fix adding slide mechenism
  const slides = new Array(10).fill(null).map((_, index) => ({ id: index + 1 }));

  // TODO: when clicking close-btn the user will be navigate to the presenation page with arranging slides
  // TO FIX!!!
  const goToPresentation = (presentationId) => {
    navigate(`/presentation/${presentationId}`);
  };

  return (
    <>
      <CssBaseline />
      <Header token={props.token} setToken={props.setToken} />
      <Box sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        padding: 3,
        pt: 13,
        position: 'relative'
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Rearranging Slides
        </Typography>
        <Grid container spacing={2} justifyContent="flex-start">
          {slides.map((slide) => (
            <Grid item key={slide.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 140,
                boxShadow: 3,
                aspectRatio: '2 / 1'
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>Slide {slide.id}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button variant="contained" onClick={() => goToPresentation(id)} sx={{ mt: 4, mb: 2 }}>
          Close
        </Button>
      </Box>
    </>
  );
}

export default RearrangingSlides;
