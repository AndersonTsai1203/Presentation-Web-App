import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Checkbox, FormControlLabel } from '@mui/material';

function AddImageModal ({ open, onClose, presentationId, slideNum, onRefresh }) {
  const [error, setError] = React.useState('');
  // add image element
  const [imagePercentage, setImagePercentage] = React.useState('');
  const [imageSrc, setImageSrc] = React.useState('');
  const [imageAlt, setImageAlt] = React.useState('');
  const [useUrl, setUseUrl] = React.useState(true);
  // get old data of current slide of image array from store
  const [store, setStore] = React.useState({});
  const [presentation, setPresentation] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState({});
  const [imageArray, setImageArray] = React.useState([]);

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
      setImageArray(response.data.store[presentationId].slides[slideNum - 1].images);
    });
  }, [slideNum, onRefresh]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const newValue = await convertToBase64(file);
    console.log(newValue)
    if (newValue === '') {
      setImageSrc(imageSrc)
    } else {
      setImageSrc(newValue);
    }
  };

  const convertToBase64 = (file) => {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    if (!valid) {
      setError({
        message: 'provided file is not a png, jpg or jpeg image.'
      });
    } else {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    }
  };

  const handleSave = () => {
    const short = require('short-uuid');
    const imageId = short.generate();
    if (imagePercentage === '' || imageSrc === '' || imageAlt === '') {
      setError({
        message: 'Please fill out all fields...'
      });
    } else {
      const newImage = {
        id: imageId,
        percentage: imagePercentage, // initial image box size
        source: imageSrc,
        tag: imageAlt,
        width: 0, // after resizing the image box
        height: 0, // after resizing the image box
        positionX: 0,
        positionY: 0,
      };
      // append the new image element to the text array
      imageArray.push(newImage);
      // update the image array in the slide
      setCurrentSlide({
        ...currentSlide,
        imageArray
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
      <Dialog open={open} onClose={onClose} aria-labelledby="add-image-modal-title">
        <DialogTitle id="add-image-modal-title">Add Image</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Image Size (e.g., 30% 50%)"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => setImagePercentage(e.target.value)}
            helperText="Enter width x height (e.g., 200px 100px)"
            onKeyDown={enterKeyHandler}
          />
          <TextField
            margin="dense"
            label="Image URL"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => setImageSrc(e.target.value)}
            disabled={!useUrl}
            onKeyDown={enterKeyHandler}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={useUrl}
                onChange={(e) => setUseUrl(e.target.checked)}
                color="primary"
              />
            }
            label="Use URL"
          />
          {!useUrl && (
            <Button
              variant="contained"
              component="label"
            >
              Upload File
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          )}
          <TextField
            margin="dense"
            label="Image Description (alt text)"
            type="text"
            fullWidth
            multiline
            variant="outlined"
            onChange={(e) => setImageAlt(e.target.value)}
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

export default AddImageModal;
