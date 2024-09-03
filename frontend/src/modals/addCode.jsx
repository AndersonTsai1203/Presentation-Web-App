import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

function AddCodeModal ({ open, onClose, presentationId, slideNum, onRefresh }) {
  const [error, setError] = React.useState('');
  // add code element
  const [codePercentage, setCodePercentage] = React.useState('');
  const [code, setCode] = React.useState('');
  const [fontSize, setFontSize] = React.useState('');
  // get old data of current slide of code array from store
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState({});
  const [codeArray, setCodeArray] = React.useState([]);

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
      setCodeArray(response.data.store[presentationId].slides[slideNum - 1].codes);
    });
  }, [slideNum, onRefresh]);

  const handleSave = () => {
    const short = require('short-uuid');
    const codeId = short.generate();
    if (codePercentage === '' || code === '' || fontSize === '') {
      setError({
        message: 'Please fill out all fields...'
      });
    } else {
      const newImage = {
        id: codeId,
        percentage: codePercentage, // initial code box size
        content: code,
        codeSize: fontSize,
        width: 0, // after resizing the code box
        height: 0, // after resizing the code box
        positionX: 0,
        positionY: 0,
      };
      // append the new code element to the text array
      codeArray.push(newImage);
      // update the code array in the slide
      setCurrentSlide({
        ...currentSlide,
        codeArray
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
      <Dialog open={open} onClose={onClose} aria-labelledby="add-code-modal-title">
        <DialogTitle id="add-code-modal-title">Add Code</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Text Area Percentage (e.g., 30% 50%)"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => setCodePercentage(e.target.value)}
            onKeyDown={enterKeyHandler}
          />
          <TextField
            margin="dense"
            label="Code"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Font Size (em)"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => setFontSize(e.target.value)}
            onKeyDown={enterKeyHandler}
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

export default AddCodeModal;
