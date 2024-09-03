import React from 'react';
import axios from 'axios';
import config from '../config.json';
import { useNavigate, Navigate } from 'react-router-dom';
import Header from '../components/header';
import { Box, CssBaseline, Grid, Button, useMediaQuery } from '@mui/material';
import CreatePresentation from '../modals/createPresentation';
import PresentationCard from '../components/card';

function Dashboard (props) {
  if (props.token === null) {
    return <Navigate to='/login' />;
  }

  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const [store, setStore] = React.useState({});

  React.useEffect(() => {
    if (isModalOpen === false) {
      axios
        .get('http://localhost:' + config.BACKEND_PORT + '/store', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          setStore(response.data.store);
        });
    }
  }, [isModalOpen]);

  const goToPresentation = (presentationId) => {
    navigate(`/presentation/${presentationId}`);
  };

  const matches = useMediaQuery('(min-width:630px)');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Header token={props.token} setToken={props.setToken} />
      <Box
        component='main'
        sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5' }}
      >
        <Button
          onClick={handleOpenModal}
          variant='contained'
          color='primary'
          sx={{ my: 8, fontSize: '0.75rem' }}
        >
          New Presentation
        </Button>
        {isModalOpen && <CreatePresentation isOpen={isModalOpen} onClose={handleCloseModal} />}
        <Grid container spacing={2}>
          {Object.entries(store).map(presentation => (
            <Grid
              item
              xs={12}
              sm={matches ? 6 : 12}
              md={4}
              key={presentation[0]}
              onClick={() => goToPresentation(presentation[0])}
            >
              <PresentationCard {...presentation[1]} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;
