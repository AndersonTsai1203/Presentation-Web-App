import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Checkbox, FormControlLabel } from '@mui/material';

function AddVideoModal ({ open, onClose, presentationId, slideNum, onRefresh }) {
  const [error, setError] = React.useState('');
  // add video element
  const [videoPercentage, setVideoPercentage] = React.useState('');
  const [videoURL, setVideoURL] = React.useState('');
  const [autoplay, setAutoplay] = React.useState(false);
  // get old data of current slide of video array from store
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState({});
  const [videoArray, setVideoArray] = React.useState([]);

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
      setVideoArray(response.data.store[presentationId].slides[slideNum - 1].videos);
    });
  }, [slideNum, onRefresh]);

  const handleSave = () => {
    const short = require('short-uuid');
    const videoId = short.generate();
    if (videoPercentage === '' || videoURL === '') {
      setError({
        message: 'Please fill out all fields...'
      });
    } else {
      const newVideo = {
        id: videoId,
        percentage: videoPercentage, // initial video box size
        source: videoURL,
        autoPlay: autoplay,
        width: 0, // after resizing the video box
        height: 0, // after resizing the video box
        positionX: 0,
        positionY: 0,
      };
      // append the new code element to the text array
      videoArray.push(newVideo);
      // update the code array in the slide
      setCurrentSlide({
        ...currentSlide,
        videoArray
      });
      // update the slide in the slide array
      const newArray = Array.from(presentationSlides);
      newArray[slideNum - 1] = currentSlide;

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
      handleSave();
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="add-video-modal-title">
        <DialogTitle id="add-video-modal-title">Add Video Properties</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Video Size (e.g., 30% 50%)"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => setVideoPercentage(e.target.value)}
            helperText="Enter width x height (e.g., 200px 100px)"
            onKeyDown={enterKeyHandler}
          />
          <TextField
            margin="dense"
            label="YouTube Video URL (Please use Embedded link)"
            type="url"
            fullWidth
            variant="outlined"
            onChange={(e) => setVideoURL(e.target.value)}
            onKeyDown={enterKeyHandler}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
                color="primary"
              />
            }
            label="Auto-play on load"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
        {error && <Error message={error.message} onClose={errorHandler} />}
      </Dialog>
    </>
  );
}

export default AddVideoModal;
