import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CreatePresentation = ({ isOpen, onClose }) => {
  const [presentationName, setPresentationName] = React.useState('');
  const [error, setError] = React.useState('');

  const handleCreate = async () => {
    console.log('Creating presentation:', presentationName);
    const short = require('short-uuid');
    const pptId = short.generate();
    const slideId = short.generate();

    if (presentationName === '') {
      setError({
        message: 'Please fill out the title name...'
      });
    } else {
      const response = await axios.get('http://localhost:' + config.BACKEND_PORT + '/store', {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })

      const store = response.data.store;

      axios.put('http://localhost:' + config.BACKEND_PORT + '/store', {
        store: {
          ...store,
          [pptId]: {
            title: presentationName,
            thumbnail: '',
            description: '',
            slides: [
              {
                id: slideId,
                background: '#FFFFFF',
                texts: [],
                images: [],
                videos: [],
                codes: []
              }
            ]
          },
        }
      },
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      onClose();
    }
  };

  const errorHandler = () => {
    setError(null);
  }

  const enterKeyHandler = (event) => {
    if (event.keyCode === 13) {
      handleCreate();
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create New Presentation</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Title Name"
          type="text"
          fullWidth
          onChange={e => setPresentationName(e.target.value)}
          onKeyDown={enterKeyHandler}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary">
          Create
        </Button>
      </DialogActions>
      {error && <Error message={error.message} onClose={errorHandler} />}
    </Dialog>
  );
}

export default CreatePresentation;
