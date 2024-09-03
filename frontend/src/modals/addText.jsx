import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function AddTextModal ({ open, onClose, presentationId, slideNum, onRefresh }) {
  const [error, setError] = React.useState('');
  // adding text element
  const [areaPercentage, setAreaPercentage] = React.useState('');
  const [textContent, setTextContent] = React.useState('');
  const [fontSize, setFontSize] = React.useState('');
  const [textColor, setTextColor] = React.useState('');

  // get old data of current slide of text array from store
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState({});
  const [textArray, setTextArray] = React.useState([]);

  // set up default font
  const [textFontFamily, setFontFamily] = React.useState('Arial');

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
      setTextArray(response.data.store[presentationId].slides[slideNum - 1].texts);
    });
  }, [slideNum, onRefresh]);

  const handleSave = () => {
    const short = require('short-uuid');
    const textId = short.generate();
    let [widthPercent, heightPercent] = areaPercentage.split(' ');
    widthPercent = widthPercent.replace('%', '');
    heightPercent = heightPercent.replace('%', '');
    if (areaPercentage === '' || textContent === '' || fontSize === '' || textColor === '') {
      setError({
        message: 'Please fill out all fields...'
      });
    } else if (parseInt(widthPercent) < 10 || parseInt(heightPercent) < 10) {
      setError({
        message: 'Please give more than 10px in width and height...'
      });
    } else {
      const newText = {
        id: textId,
        percentage: areaPercentage, // initial textbox size
        content: textContent,
        width: 0, // after resizing the textbox
        height: 0, // after resizing the textbox
        positionX: 0,
        positionY: 0,
        textSize: fontSize,
        color: textColor,
        fontFamily: textFontFamily
      };
      // append the new text element to the text array
      textArray.push(newText);
      // update the text array in the slide
      setCurrentSlide({
        ...currentSlide,
        textArray
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
      <Dialog open={open} onClose={onClose} aria-labelledby="add-text-modal-title">
        <DialogTitle id="add-text-modal-title">Add Text Properties</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Text Area Percentage (e.g., 30% 50%)"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => setAreaPercentage(e.target.value)}
            onKeyDown={enterKeyHandler}
          />
          <TextField
            margin="dense"
            label="Text Content"
            type="text"
            fullWidth
            multiline
            variant="outlined"
            onChange={(e) => setTextContent(e.target.value)}
            onKeyDown={enterKeyHandler}
          />
          <TextField
            margin="dense"
            label="Font Size (em) as decimal"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => setFontSize(e.target.value)}
            onKeyDown={enterKeyHandler}
          />
          <TextField
            margin="dense"
            label="Text Color (HEX) (e.g., #FF0000)"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => setTextColor(e.target.value)}
            onKeyDown={enterKeyHandler}
          />
        </DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel id="font-family-label">Font Family</InputLabel>
          <Select
            labelId="font-family-label"
            value={textFontFamily}
            label="Font Family"
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
          </Select>
        </FormControl>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
        {error && <Error message={error.message} onClose={errorHandler} />}
      </Dialog>
    </>
  );
}

export default AddTextModal;
