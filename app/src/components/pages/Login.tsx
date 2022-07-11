import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { useMutation } from '@apollo/client';
import { LOGIN } from 'api/Mutations';
import Cookie from 'universal-cookie';
import { LoadingContext } from 'contexts/LoadingContext';
import { GET_USER_BY_ID } from 'api/Queries';
import { ErrorContext } from 'contexts/ErrorContext';
import jwt_decode from 'jwt-decode';
import { useLazyQuery } from '@apollo/client';
import { Role } from 'types/api.types';

interface JWTResponse {
  userId: number;
  iat: number;
}

const Login = () => {
  const cookie = new Cookie();
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(0);
  const [tokenLoaded, setTokenLoaded] = useState<boolean>(false);

  const [formState, setFormState] = useState({
    username: '',
    password: ''
  });

  const [login, { data: loginData, loading: loginLoading, error: loginError }] = useMutation(LOGIN);
  const [getUserByID, { data: getUserData, loading: getUserLoading, error: getUserError }] =
    useLazyQuery(GET_USER_BY_ID);

  useEffect(() => {
    loadingContext.setLoading(loginLoading);
    if (loginData) {
      const loginResponse = loginData.login;
      if (loginResponse.success) {
        const userInfo: JWTResponse = jwt_decode(loginResponse.token);
        setUserId(userInfo.userId);
        setTokenLoaded(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData, loginLoading, loginError]);

  useEffect(() => {
    loadingContext.setLoading(getUserLoading);
    if (getUserData) {
      if (getUserData.findUserById.role === Role.Admin) {
        cookie.set('user', { username: formState.username, role: Role.Admin });
        window.location.href = '/';
      } else {
        cookie.set('user', { username: formState.username, role: Role.User });
        window.location.href = '/';
      }
    }
    if (getUserError) {
      errorContext.setErrorDialog(getUserError);
    }
  }, [getUserData, getUserLoading, getUserError]);

  useEffect(() => {
    if (tokenLoaded) {
      getUserByID({ variables: { id: userId } });
    }
  }, [tokenLoaded]);

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
