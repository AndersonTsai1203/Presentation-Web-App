import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function EditTextElement ({ isOpen, onClose, slideNum, presentationId, textId, onRefresh }) {
  const [error, setError] = React.useState('');

  // get old data of current slide of text array from store
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState({});
  const [textArray, setTextArray] = React.useState([]);

  // handle text details change
  const [textPercentage, setTextPercentage] = React.useState('');
  const [textContent, setTextContent] = React.useState('');
  const [textPositionX, setPositionX] = React.useState(0);
  const [textPositionY, setPositionY] = React.useState(0);
  const [fontSize, setFontSize] = React.useState('');
  const [textColor, setTextColor] = React.useState('');
  const [selectedFont, setSelectedFont] = React.useState('');
  const [textWidth, setTextWidth] = React.useState(0);
  const [textHeight, setTextHeight] = React.useState(0);

  let index = null;

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

      // find the index of the current text element in the text array to get old data
      index = (response.data.store[presentationId].slides[slideNum - 1].texts).findIndex(text => text.id === textId);
      setTextPercentage(response.data.store[presentationId].slides[slideNum - 1].texts[index].percentage);
      setTextContent(response.data.store[presentationId].slides[slideNum - 1].texts[index].content);
      setPositionX(response.data.store[presentationId].slides[slideNum - 1].texts[index].positionX);
      setPositionY(response.data.store[presentationId].slides[slideNum - 1].texts[index].positionY);
      setFontSize(response.data.store[presentationId].slides[slideNum - 1].texts[index].textSize);
      setTextColor(response.data.store[presentationId].slides[slideNum - 1].texts[index].color);
      setSelectedFont(response.data.store[presentationId].slides[slideNum - 1].texts[index].fontFamily);
      setTextWidth(response.data.store[presentationId].slides[slideNum - 1].texts[index].width);
      setTextHeight(response.data.store[presentationId].slides[slideNum - 1].texts[index].height);
    });
  }, [slideNum, onRefresh]);

  const handleSave = () => {
    let [widthPercent, heightPercent] = textPercentage.split(' ');
    widthPercent = widthPercent.replace('%', '');
    heightPercent = heightPercent.replace('%', '');
    if (textPercentage === '' || textContent === '' || fontSize === '' || textColor === '') {
      setError({
        message: 'Please fill out all fields...'
      });
    } else if (parseInt(widthPercent) < 5 || parseInt(heightPercent) < 5) {
      setError({
        message: 'Please give more than 5% in width and height...'
      });
    } else {
      const updatedText = {
        id: textId,
        percentage: textPercentage,
        content: textContent,
        width: textWidth,
        height: textHeight,
        positionX: textPositionX,
        positionY: textPositionY,
        textSize: fontSize,
        color: textColor,
        fontFamily: selectedFont
      };
      textArray.splice(index, 1, updatedText)
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
      <Dialog open={isOpen} onClose={onClose} aria-labelledby="add-text-modal-title">
        <DialogTitle id="add-text-modal-title">Edit Text Properties</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Text Area Size (e.g., 100px 200px)"
            type="text"
            fullWidth
            variant="outlined"
            value={textPercentage}
            onChange={(e) => setTextPercentage(e.target.value)}
            onKeyDown={enterKeyHandler}
          />
          <TextField
            margin="dense"
            label="Text Content"
            type="text"
            fullWidth
            multiline
            variant="outlined"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            onKeyDown={enterKeyHandler}
          />
          <TextField
            margin="dense"
            label="Font Size (em) as decimal"
            type="text"
            fullWidth
            variant="outlined"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            onKeyDown={enterKeyHandler}
          />
          <TextField
            margin="dense"
            label="Text Color (HEX) (e.g., #FF0000)"
            type="text"
            fullWidth
            variant="outlined"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            onKeyDown={enterKeyHandler}
          />
        </DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel id="font-family-label">Font Family</InputLabel>
          <Select
            labelId="font-family-label"
            value={selectedFont}
            label="Font Family"
            onChange={(e) => setSelectedFont(e.target.value)}
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

export default EditTextElement;
