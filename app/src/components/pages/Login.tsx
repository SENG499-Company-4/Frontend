import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { useMutation } from '@apollo/client';
import { LOGIN } from 'api/Mutations';
import { Role } from 'constants/timetable.constants';
import Cookie from 'universal-cookie';
import { LoadingContext } from 'contexts/LoadingContext';

const Login = () => {
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    username: '',
    password: ''
  });

  const loadingContext = useContext(LoadingContext);

  const cookie = new Cookie();

  const [login, { data: loginData, loading: loginLoading, error: loginError }] = useMutation(LOGIN);

  useEffect(() => {
    loadingContext.setLoading(loginLoading);
    if (loginData) {
      const loginResponse = loginData.login;
      if (loginResponse.success) {
        if (loginResponse.message.includes('keith')) {
          cookie.set('user', { username: formState.username, role: Role.Admin });
          window.location.href = '/';
        } else {
          cookie.set('user', { username: formState.username, role: Role.User });
          window.location.href = '/';
        }
      }
    }
    if (loginData && !hasErrors) {
      setHasErrors(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData, loginLoading, loginError]);

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
            value={formState.username}
            onChange={(e) =>
              setFormState({
                ...formState,
                username: e.target.value
              })
            }
          />
        </Grid>
        <Grid item>
          <TextField
            id="outlined-password-input"
            style={{ width: 300 }}
            label="Password"
            type="password"
            value={formState.password}
            onChange={(e) =>
              setFormState({
                ...formState,
                password: e.target.value
              })
            }
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            style={{ width: 300, marginTop: 15 }}
            onClick={() =>
              login({
                variables: {
                  username: formState.username,
                  password: formState.password
                }
              })
            }
          >
            Sign In
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
