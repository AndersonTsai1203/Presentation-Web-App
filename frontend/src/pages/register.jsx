import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Error from '../components/error';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Grid, Link, Paper } from '@mui/material';

function Register (props) {
  const [email, setEmail] = React.useState('');
  const [password1, setPassword1] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('')
  const navigate = useNavigate();

  const register = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '' && password1 === '' && name === '') {
      setError({
        message: 'Please fill out all fields...'
      });
    } else if (email === '') {
      setError({
        message: 'Please fill out email fields...'
      });
    } else if (!emailRegex.test(email)) {
      setError({
        message: 'Invalid email expression...'
      });
    } else if (password1 === '') {
      setError({
        message: 'Please fill out password field...'
      });
    } else if (password1 !== password2) {
      setError({
        message: 'passwords don\'t match...'
      });
    } else if (name === '') {
      setError({
        message: 'Please fill out name field...'
      });
    } else {
      try {
        console.log(email, password1, name);
        const response = await axios.post('http://localhost:' + config.BACKEND_PORT + '/admin/auth/register', {
          email,
          password: password1,
          name
        });
        props.setToken(response.data.token);
        navigate('/dashboard');
      } catch (err) {
        setError({
          message: err.response.data.error
        });
      }
    }
  }

  const goToLogin = () => {
    navigate('/login');
  }

  const errorHandler = () => {
    setError(null);
  }

  const enterKeyHandler = (event) => {
    if (event.keyCode === 13) {
      register();
    }
  }

  return (
    <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Paper elevation={6} style={{ padding: '40px', width: '100%', maxWidth: '400px', marginTop: '10vh', borderRadius: '10px' }}>
        {error && <Error message={error.message} onClose={errorHandler} />}
        <Typography variant="h5" align="center" gutterBottom>Sign Up</Typography>
        <TextField
          label="Email"
          type="text"
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
          value={password1}
          onChange={e => setPassword1(e.target.value)}
          onKeyDown={enterKeyHandler}
          margin="normal"
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          onKeyDown={enterKeyHandler}
          margin="normal"
        />
        <TextField
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={enterKeyHandler}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={register} fullWidth style={{ borderRadius: '20px', marginTop: '20px' }}>
          Sign Up
        </Button>
        <Typography variant="body2" align="center" style={{ marginTop: '16px' }}>
          Already have an account?{' '}
          <Link component="button" variant="body2" onClick={goToLogin} style={{ textDecoration: 'none' }}>
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Register;
