import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import LogoutBtn from '../components/logoutBtn'

const Header = ({ token, setToken }) => (
    <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                Presto
            </Typography>
            <LogoutBtn token={token} setToken={setToken} />
        </Toolbar>
    </AppBar>
);

export default Header;
