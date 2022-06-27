import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { useMutation } from '@apollo/client';
import { LOGIN } from 'components/shared/api/Mutations';
import { Role } from 'components/shared/constants/timetable.constants';
import Cookie from 'universal-cookie';
import { LoadingContext } from 'contexts/LoadingContext';

function Login() {
  const [formState, setFormState] = useState({
    username: '',
    password: ''
  });

  const { setLoading } = useContext(LoadingContext);

  const [hasErrors, setHasErrors] = useState<boolean>(false);

  const cookie = new Cookie();

  const navigate = useNavigate();

  const [loginHandler, { data, loading, error }] = useMutation(LOGIN);

  if (data) {
    const loginResponse = data.login;
    console.log(loginResponse);
    if (loginResponse.success) {
      if (loginResponse.message.includes('keith')) {
        cookie.set('user', { username: formState.username, role: Role.Admin });
        navigate('/');
      } else {
        cookie.set('user', { username: formState.username, role: Role.User });
        navigate('/');
      }
    } else if (!hasErrors) {
      setHasErrors(true);
    }
    setLoading(false);
  } else if (loading) {
    setLoading(true);
  } else if (error && !hasErrors) {
    console.log(error);
    setHasErrors(true);
    setLoading(false);
  }
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
              loginHandler({
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
}

export default Login;
