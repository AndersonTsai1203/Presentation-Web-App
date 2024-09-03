import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';

function ThemeColorModal ({ open, onClose, presentationId, slideNum, onRefresh }) {
  const [error, setError] = React.useState('');
  const [backgroundColor, setBackgroundColor] = React.useState('');
  const [backgroundGradient, setBackgroundGradient] = React.useState('');

  // get old data of current slide from store
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState({});

  React.useEffect(() => {
    axios.get('http://localhost:' + config.BACKEND_PORT + '/store', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      setStore(response.data.store);
      setPresentation(response.data.store[presentationId]);
      setPresentationSlides(response.data.store[presentationId].slides);
      setCurrentSlide(response.data.store[presentationId].slides[slideNum - 1]);
    });
  }, [slideNum, onRefresh]);

  const handleApply = () => {
    let picker = '';
    if (backgroundColor !== '' && backgroundGradient !== '') {
      setError({
        message: 'Please fill out only one field...'
      })
    } else {
      if (backgroundColor === '') {
        picker = backgroundGradient;
      } else {
        picker = backgroundColor;
      }
      console.log(picker);
      const updatedSlide = {
        id: currentSlide.id,
        background: picker,
        texts: currentSlide.texts,
        images: currentSlide.images,
        videos: currentSlide.videos,
        codes: currentSlide.codes
      }
      // update the slide in the slide array
      const newArray = Array.from(presentationSlides);
      newArray[slideNum - 1] = updatedSlide;

      axios.put('http://localhost:' + config.BACKEND_PORT + '/store', {
        store: {
          ...store,
          [presentationId]: {
            ...presentation,
            slides: newArray
          }
        }
      },
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      onRefresh();
      onClose();
    }
  };

  const errorHandler = () => {
    setError(null);
  }

  const enterKeyHandler = (event) => {
    if (event.keyCode === 13) {
      handleApply();
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set Background (Enter either one field)</DialogTitle>
      <DialogContent>
        <TextField
            label="Solid colour"
            type="text"
            fullWidth
            helperText="Example: Hex code (#000000)"
            margin="dense"
            onChange={(e) => setBackgroundColor(e.target.value)}
            onKeyDown={enterKeyHandler}
        />
        <TextField
            label="Gradient (CSS syntax)"
            type="text"
            fullWidth
            helperText="Example: linear-gradient(red, yellow)"
            margin="dense"
            onChange={(e) => setBackgroundGradient(e.target.value)}
            onKeyDown={enterKeyHandler}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </DialogActions>
      {error && <Error message={error.message} onClose={errorHandler} />}
    </Dialog>
  );
}

export default ThemeColorModal;
