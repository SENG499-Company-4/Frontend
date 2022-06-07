import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/register`;
    navigate(path);
  }

  const signIn = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
  }

  return (
    <Box
      component="form"
      sx={{
        width: 300,
        height: 300,
      }}
      mx='auto'
      justifyContent='center'
      noValidate
      autoComplete="off"
    >
      <div className='login'>
        <Link to='/'>
          <img style={{ width: 300, marginTop: 60 }} className='login_logo' src='https://web.uvic.ca/~virsf/graphics/UVic%20Logo.png' alt='' />
        </Link>
        <div className='login_container'>
          <h1>Sign In</h1>
          <form>
            <h5>UVIC Email</h5>
            <TextField
              id="outlined-required"
              label="Username"
              style={{ width: '100%' }}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <h5>Password</h5>
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              style={{ width: '100%' }}
              value={password}
              onChange={p => setPassword(p.target.value)}
            />
            <Button variant='contained' style={{ width: '100%', marginTop: 15 }} onClick={signIn}>Sign In</Button>
          </form>
          <Button variant='outlined' style={{ width: '100%', marginTop: 15 }} onClick={routeChange}>Register</Button>
        </div>
      </div >
    </Box >
  )
}

export default Login
