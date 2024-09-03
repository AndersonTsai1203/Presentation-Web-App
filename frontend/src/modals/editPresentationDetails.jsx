import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

function EditPresentationDetails ({ isOpen, onClose, id, onRefresh }) {
  const [error, setError] = React.useState('');
  const [store, setStore] = React.useState({});
  const [presentationSlides, setPresentationSlides] = React.useState([]);
  const [currentTitle, setTitle] = React.useState('');
  const [currentDescription, setDescription] = React.useState('');
  const [currentThumbnail, setThumbnail] = React.useState('');

  React.useEffect(() => {
    axios.get('http://localhost:' + config.BACKEND_PORT + '/store', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }).then((response) => {
      setStore(response.data.store);
      setPresentationSlides(response.data.store[id].slides);
      setTitle(response.data.store[id].title);
      setDescription(response.data.store[id].description);
      setThumbnail(response.data.store[id].thumbnail);
    });
  }, [])

  const handleSave = async () => {
    if (currentTitle === '') {
      setError({
        message: 'Please fill out the title name...'
      });
    } else {
      axios.put('http://localhost:' + config.BACKEND_PORT + '/store', {
        store: {
          ...store,
          [id]: {
            title: currentTitle,
            thumbnail: currentThumbnail,
            description: currentDescription,
            slides: presentationSlides
          },
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

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    const newValue = await convertToBase64(file);
    console.log(newValue)
    if (newValue === '') {
      setThumbnail(currentThumbnail)
    } else {
      setThumbnail(newValue);
    }
  }

  const enterKeyHandler = (event) => {
    if (event.keyCode === 13) {
      handleSave();
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby='edit-presentation-details-title'
    >
      <DialogTitle id='edit-presentation-details-title'>
        Edit Details
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          id='title'
          label='Title'
          type='text'
          fullWidth
          variant='outlined'
          value={currentTitle}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={enterKeyHandler}
        />
        <TextField
          margin='dense'
          id='description'
          label='Description'
          type='text'
          fullWidth
          multiline
          rows={4}
          variant='outlined'
          value={currentDescription}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={enterKeyHandler}
        />
        <Box textAlign='center' marginTop={2}>
          <input
            accept='image/*'
            style={{ display: 'none' }}
            id='thumbnail-upload'
            type='file'
            onChange={handleThumbnailChange}
          />
          <label htmlFor='thumbnail-upload'>
            <Button color='primary' component='span' variant='outlined'>
              Upload Thumbnail
            </Button>
          </label>
          {currentThumbnail && (
            <img
              src={currentThumbnail}
              alt='Thumbnail'
              style={{ maxWidth: '100%', marginTop: 8 }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSave} color='primary'>
          Save
        </Button>
      </DialogActions>
      {error && <Error message={error.message} onClose={errorHandler} />}
    </Dialog>
  );
}

export default EditPresentationDetails;
