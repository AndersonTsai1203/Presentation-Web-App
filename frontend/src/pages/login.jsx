import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Grid, Link, Paper } from '@mui/material';

function Login (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('')
  const navigate = useNavigate();

  const login = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '' && password === '') {
      setError({
        message: 'Please fill out all fields'
      });
    } else if (email === '') {
      setError({
        message: 'Please fill out email field'
      });
    } else if (password === '') {
      setError({
        message: 'Please fill out password fields'
      });
    } else if (!emailRegex.test(email)) {
      setError({
        message: 'Invalid email expression...'
      });
    } else {
      try {
        const response = await axios.post('http://localhost:' + config.BACKEND_PORT + '/admin/auth/login', {
          email,
          password
        })
        props.setToken(response.data.token);
        navigate('/dashboard');
      } catch (err) {
        setError({
          message: err.response.data.error
        })
      }
    }
  }

  const goToRegister = () => {
    navigate('/register')
  }

  const errorHandler = () => {
    setError(null);
  }

  const enterKeyHandler = (event) => {
    if (event.keyCode === 13) {
      login();
    }
  }

  return (
    <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Paper elevation={6} style={{ padding: '40px', width: '100%', maxWidth: '400px', marginTop: '10vh', borderRadius: '10px' }}>
        {error && <Error message={error.message} onClose={errorHandler} />}
        <Typography variant="h5" align="center" gutterBottom>Sign In</Typography>
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={enterKeyHandler}
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={enterKeyHandler}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={login} fullWidth style={{ borderRadius: '20px', marginTop: '20px' }}>
          Sign In
        </Button>
        <Typography variant="body2" align="center" style={{ marginTop: '16px' }}>
          New to Presto?{' '}
          <Link component="button" variant="body2" onClick={goToRegister} style={{ textDecoration: 'none' }}>
            Create an Account
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Login;
