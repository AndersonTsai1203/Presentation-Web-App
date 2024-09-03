import React from 'react';
import axios from 'axios';
import config from '../config.json';
import Button from '@mui/material/Button';

function LogoutBtn (props) {
  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:' + config.BACKEND_PORT + '/admin/auth/logout',
        {},
        {
          headers: {
            Authorization: props.token,
          },
        }
      );
      props.setToken(null);
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <Button
    onClick={logout}
    color='inherit'
    variant='text'
>
    Logout
</Button>
  );
}

export default LogoutBtn;
