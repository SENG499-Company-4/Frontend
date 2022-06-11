import React, { useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  let navigate: NavigateFunction = useNavigate();

  const signIn = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <Box component="form" sx={{ width: 300 }} mx="auto" justifyContent="center" noValidate autoComplete="off">
      <Grid container spacing={2} className="login">
        <Link to="/">
          <img
            style={{ width: 300, marginTop: 60 }}
            className="login_logo"
            src="https://web.uvic.ca/~virsf/graphics/UVic%20Logo.png"
            alt=""
          />
        </Link>
        <Grid item>
          <Typography variant="h3">Sign In</Typography>
        </Grid>
        <Grid item>
          <TextField
            id="outlined-username-input"
            style={{ width: 300 }}
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            id="outlined-password-input"
            style={{ width: 300 }}
            label="Password"
            type="password"
            value={password}
            onChange={(p) => setPassword(p.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" style={{ width: 300, marginTop: 15 }} onClick={signIn}>
            Sign In
          </Button>
          <Button variant="outlined" style={{ width: 300, marginTop: 15 }} onClick={() => navigate(`/register`)}>
            Register
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
