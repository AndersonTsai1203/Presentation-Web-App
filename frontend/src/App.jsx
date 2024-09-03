import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Presentation from './pages/presentation';
import RearrangingSlides from './pages/rearrangingSlidePage';
import Preview from './pages/preview';

function App () {
  const [token, setToken] = React.useState('');

  const setLocalToken = (t) => {
    setToken(t);
    localStorage.setItem('token', t);
  }

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, [token]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
          <Route path='/register' element={<Register token={token} setToken={setLocalToken}/>} />
          <Route path='/login' element={<Login token={token} setToken={setLocalToken} />} />
          <Route path='/dashboard' element={<Dashboard token={token} setToken={setLocalToken} />} />
          <Route path='/presentation/:id' element={<Presentation token={token} setToken={setLocalToken} />} />
          <Route path='/rearrangingSlidePage/:id' element={<RearrangingSlides token={token} setToken={setLocalToken} />} />
          <Route path='/preview/:id' element={<Preview token={token} setToken={setLocalToken} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

/**
 *
 */
