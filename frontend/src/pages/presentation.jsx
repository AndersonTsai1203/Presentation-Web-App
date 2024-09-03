import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Button, Stack, Grid, Typography, Container, Box } from '@mui/material';
import axios from 'axios';
import config from '../config.json';
import Header from '../components/header';
import Error from '../components/error';
import SlidePage from '../components/slidePage';
import DeletePresentation from '../modals/deletePresentation';
import EditPresentationDetails from '../modals/editPresentationDetails';
import AddTextModal from '../modals/addText';
import AddImageModal from '../modals/addImage';
import AddVideoModal from '../modals/addVideo';
import AddCodeModal from '../modals/addCode';
import ThemeColorModal from '../modals/themeColor';

// global variable
let slideId = null;

function Presentation (props) {
  if (props.token === null) {
    return <Navigate to='/login' />
  }

  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [slideIndex, setSlideIndex] = React.useState(0); // index in array starts from 0
  const [currentSlideNum, setCurrentSlideNum] = React.useState(1)

  const getCurrentPresentationDetails = () => {
    axios.get('http://localhost:' + config.BACKEND_PORT + '/store', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      setStore(response.data.store);
      setPresentation(response.data.store[id]);
      setPresentationSlides(response.data.store[id].slides);
    });
  }

  React.useEffect(() => {
    getCurrentPresentationDetails();
  }, []);

  const goToDashboard = () => {
    navigate('/dashboard');
  }

  const goToRearranging = (id) => {
    navigate(`/rearrangingSlidePage/${id}`);
  }

  const goToPreview = (id) => {
    navigate(`/preview/${id}`);
  }

  const deletePresentation = (presentationId) => {
    delete store[presentationId];
    axios.put('http://localhost:' + config.BACKEND_PORT + '/store', {
      store
    },
    {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    });
    goToDashboard();
  }

  // handle delete presentation modal
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const handleDeleteOpen = () => setDeleteOpen(true);
  const handleDeleteClose = () => setDeleteOpen(false);

  // handle edit presentation details modal
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const handleDetailsOpen = () => setDetailsOpen(true);
  const handleDetailsClose = () => setDetailsOpen(false);

  // add new slide to the presentation
  const addSlide = () => {
    const short = require('short-uuid');
    slideId = short.generate();
    const newSlide = {
      id: slideId,
      background: '#FFFFFF',
      texts: [],
      images: [],
      videos: [],
      codes: []
    }
    axios.put('http://localhost:' + config.BACKEND_PORT + '/store', {
      store: {
        ...store,
        [id]: {
          ...presentation,
          slides: [
            ...presentationSlides,
            newSlide
          ]
        }
      }
    },
    {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    });
    getCurrentPresentationDetails();
  }

  // delete current displayed slide from the presentation
  const deleteSlide = () => {
    if (presentationSlides.length === 1) {
      setError({
        message: ' maybe try to delete the presentation...'
      });
    } else {
      presentationSlides.splice(slideIndex, 1);
      axios.put('http://localhost:' + config.BACKEND_PORT + '/store', {
        store: {
          ...store,
          [id]: {
            ...presentation,
            slides: presentationSlides
          }
        }
      },
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
    }
    getCurrentPresentationDetails();
    if (slideIndex === 0 || presentationSlides.length === 1) { // check if the current slide has no previous slide or only have one slide in presentation
      setSlideIndex(0);
      setCurrentSlideNum(1);
    } else if (slideIndex === presentationSlides.length - 1) { // check if the current slide is the last position of slide
      setSlideIndex(presentationSlides.length - 1);
      setCurrentSlideNum(presentationSlides.length);
    } else { // current slide has both previous and next slide
      setSlideIndex(slideIndex - 1);
      setCurrentSlideNum(currentSlideNum - 1);
    }
  }

  // handle keyboard left and right arrow key to move between slides
  const arrowKeyHandler = (event) => {
    if (event.keyCode === 37) { // left arrow key
      prevSlide()
    } else if (event.keyCode === 39) { // right arrow key
      nextSlide();
    }
  }

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

  const errorHandler = () => {
    setError(null);
  }

  // handle add text element modal
  const [textOpen, setTextOpen] = React.useState(false);
  const handleTextOpen = () => setTextOpen(true);
  const handleTextClose = () => setTextOpen(false);

  // handle add image element modal
  const [imageOpen, setImageOpen] = React.useState(false);
  const handleImageOpen = () => setImageOpen(true);
  const handleImageClose = () => setImageOpen(false);

  // handle add video element modal
  const [videoOpen, setVideoOpen] = React.useState(false);
  const handleVideoOpen = () => setVideoOpen(true);
  const handleVideoClose = () => setVideoOpen(false);

  // handle add code element modal
  const [codeOpen, setCodeOpen] = React.useState(false);
  const handleCodeOpen = () => setCodeOpen(true);
  const handleCodeClose = () => setCodeOpen(false);

  // handle add code element modal
  const [themeOpen, setThemeOpen] = React.useState(false);
  const handleThemeOpen = () => setThemeOpen(true);
  const handleThemeClose = () => setThemeOpen(false);

  return (
    <>
      <Container>
        <Header token={props.token} setToken={props.setToken} />
        <Grid container spacing={3} sx={{ mt: 8 }}>
          <Grid item xs={12} sm={3} md={3}>
            <Stack spacing={2} sx={{ maxWidth: 220 }}>
              <Button onClick={goToDashboard} variant='outlined' sx={{ textTransform: 'none', width: '90%' }}>Back to Dashboard</Button>
              <Button onClick={handleDeleteOpen} variant='contained' sx={{ textTransform: 'none', width: '90%' }}>Delete Presentation</Button>
              <Button onClick={addSlide} variant='contained' sx={{ textTransform: 'none', width: '90%' }}>Add Slide</Button>
              <Button onClick={deleteSlide} variant='contained' sx={{ textTransform: 'none', width: '90%' }}>Delete Slide</Button>
              <Button onClick={handleDetailsOpen} variant='contained' sx={{ textTransform: 'none', width: '90%' }}>Edit Details</Button>
              <Button onClick={() => goToPreview(id)} variant='outlined' sx={{ textTransform: 'none', width: '90%' }}>Preview Presentation</Button>
              <Stack direction="column" spacing={2}>
                <Typography variant='h6'gutterBottom>Add content</Typography>
                <div>
                  <Button onClick={handleTextOpen} variant='contained' sx={{ textTransform: 'none', width: '50%', height: '10%', borderRadius: '30px' }}>Text</Button>
                  {textOpen && <AddTextModal open={textOpen} onClose={handleTextClose} presentationId={id} slideNum={currentSlideNum} onRefresh={() => getCurrentPresentationDetails()}/>}
                </div>
                <div>
                  <Button onClick={handleVideoOpen} variant='contained' sx={{ textTransform: 'none', width: '50%', height: '10%', borderRadius: '30px' }}>Video</Button>
                  {videoOpen && <AddVideoModal open={videoOpen} onClose={handleVideoClose} presentationId={id} slideNum={currentSlideNum} onRefresh={() => getCurrentPresentationDetails()}/>}
                </div>
                <div>
                  <Button onClick={handleImageOpen} variant='contained' sx={{ textTransform: 'none', width: '50%', height: '10%', borderRadius: '30px' }}>Image</Button>
                  {imageOpen && <AddImageModal open={imageOpen} onClose={handleImageClose} presentationId={id} slideNum={currentSlideNum} onRefresh={() => getCurrentPresentationDetails()}/>}
                </div>
                <div>
                  <Button onClick={handleCodeOpen} variant='contained' sx={{ textTransform: 'none', width: '50%', height: '10%', borderRadius: '30px' }}>Code</Button>
                  {codeOpen && <AddCodeModal open={codeOpen} onClose={handleCodeClose} presentationId={id} slideNum={currentSlideNum} onRefresh={() => getCurrentPresentationDetails()}/>}
                </div>
                <div>
                  <Button onClick={() => goToRearranging(id)} variant='outlined' sx={{ textTransform: 'none', width: '50%', height: '10%', borderRadius: '30px' }}>Rearranging slides</Button>
                </div>
                <div>
                  <Button onClick={handleThemeOpen} variant='outlined' sx={{ textTransform: 'none', width: '50%', height: '10%', borderRadius: '30px' }}>Change theme</Button>
                  {themeOpen && <ThemeColorModal open={themeOpen} onClose={handleThemeClose} presentationId={id} slideNum={currentSlideNum} onRefresh={() => getCurrentPresentationDetails()}/>}
                </div>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={9} md={9}>
            <Typography variant='h4' gutterBottom>Presentation Details</Typography>
            <Typography variant='subtitle1' gutterBottom>Title: {presentation.title}</Typography>
            <Typography variant='subtitle1' gutterBottom>Description: {presentation.description}</Typography>
            <SlidePage slideNum={currentSlideNum} presentationId={id} onRefresh={() => getCurrentPresentationDetails()}/>
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
          </Grid>
        </Grid>
        {error && <Error message={error.message} onClose={errorHandler} />}
        {deleteOpen && <DeletePresentation isOpen={deleteOpen} onClose={handleDeleteClose} onDelete={() => deletePresentation(id)} />}
        {detailsOpen && <EditPresentationDetails
          isOpen={detailsOpen}
          onClose={handleDetailsClose}
          id={id}
          onRefresh={() => getCurrentPresentationDetails()}/>}
      </Container>
    </>
  );
}

export default Presentation;
