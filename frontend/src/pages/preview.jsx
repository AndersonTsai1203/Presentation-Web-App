import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config.json';
import Header from '../components/header';
import SlidePage from '../components/slidePage';
import { Button, Stack, Grid, Typography, Container, Box } from '@mui/material';

function Preview (props) {
  if (props.token === null) {
    return <Navigate to='/login' />
  }

  const { id } = useParams();
  const navigate = useNavigate();
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [slideIndex, setSlideIndex] = React.useState(0); // index in array starts from 0
  const [currentSlideNum, setCurrentSlideNum] = React.useState(1)

  const backToPresentation = (id) => {
    navigate(`/presentation/${id}`)
  }

  const getCurrentPresentationDetails = () => {
    axios.get('http://localhost:' + config.BACKEND_PORT + '/store', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      setPresentationSlides(response.data.store[id].slides);
    });
  }

  React.useEffect(() => {
    getCurrentPresentationDetails()
  }, []);

  // move to the next slide
  const nextSlide = () => {
    if (currentSlideNum < presentationSlides.length && slideIndex < presentationSlides.length - 1) {
      setSlideIndex(slideIndex + 1);
      setCurrentSlideNum(currentSlideNum + 1);
    } else {
      console.log('reached to the end...');
    }
    getCurrentPresentationDetails();
  }

  // move to the previous slide
  const prevSlide = () => {
    if (currentSlideNum > 1 && slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
      setCurrentSlideNum(currentSlideNum - 1);
    } else {
      console.log('reached to the start...');
    }
    getCurrentPresentationDetails();
  }

  // handle keyboard left and right arrow key to move between slides
  const arrowKeyHandler = (event) => {
    if (event.keyCode === 37) { // left arrow key
      prevSlide()
    } else if (event.keyCode === 39) { // right arrow key
      nextSlide();
    }
  }

  return (
    <>
      <Container>
        <Header token={props.token} setToken={props.setToken} />
        <Grid container spacing={3} sx={{ mt: 8 }}>
          <Grid item xs={12} sm={3} md={3}>
            <Stack spacing={2} sx={{ maxWidth: 220 }}>
              <Button onClick={() => backToPresentation(id)} variant='outlined' sx={{ textTransform: 'none', width: '90%' }}>Back to Edit Presentation</Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={9} md={9}>
            <SlidePage slideNum={currentSlideNum} presentationId={id} onRefresh={() => getCurrentPresentationDetails()}/>
          </Grid>
        </Grid>
        <footer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
            <Button onClick={prevSlide} onKeyDown={arrowKeyHandler} disabled={slideIndex === 0 || presentationSlides.length === 0}>
                ❮
            </Button>
            <Typography sx={{ mx: 2, alignSelf: 'center' }}>
              Slide {currentSlideNum} of {presentationSlides.length}
            </Typography>
            <Button onClick={nextSlide} onKeyDown={arrowKeyHandler} disabled={slideIndex === presentationSlides.length - 1 || presentationSlides.length === 0}>
                ❯
            </Button>
          </Box>
        </footer>
      </Container>
    </>
  );
}

export default Preview;
