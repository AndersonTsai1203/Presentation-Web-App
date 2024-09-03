import React from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, useTheme, useMediaQuery } from '@mui/material';

function Error (props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={!!props.message}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullScreen={fullScreen}
      PaperProps={{
        style: {
          backgroundColor: '#ffffff',
          boxderRadius: '25px',
          width: '100%',
          maxWidth: '200px',
          maxHeight: '200px'
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Error
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" style={{ color: '#757575' }}>
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button
          onClick={props.onClose}
          color="primary"
          variant="contained"
          style={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Error;
