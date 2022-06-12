import React, { useEffect, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { Role } from 'components/shared/constants/timetable.constants';
import Cookie from 'universal-cookie';

function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [hasErrors, setHasErrors] = useState<boolean>(false);

  const cookie = new Cookie();

  let navigate: NavigateFunction = useNavigate();

  // This is a temporary hack to demo login.
  // Enter either "USER" or "ADMIN" in the username box to log in as a user or admin.
  const signIn = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (username === Role.Admin) {
      cookie.set('user', { username: 'Admin', role: Role.Admin });
      navigate('/');
    } else if (username === Role.User) {
      cookie.set('user', { username: 'User', role: Role.User });
      navigate('/');
    } else {
      setHasErrors(true);
    }
  };

  useEffect(() => {
    setHasErrors(false);
  }, [username, password]);

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
        {hasErrors && (
          <Grid item>
            <Typography variant="body1" color="error">
              Username or password is incorrect.
            </Typography>
          </Grid>
        )}
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
