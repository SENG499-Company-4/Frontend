import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Card, Grid } from '@mui/material';
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
  const [errorMessage, setErrorMessage] = useState<string>('');
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
        localStorage.setItem('token', loginResponse.token);
        const userInfo: JWTResponse = jwt_decode(loginResponse.token);
        setUserId(userInfo.userId);
        setTokenLoaded(true);
      } else {
        setHasErrors(true);
        setErrorMessage(loginResponse.message);
      }
    }
    if (loginError) {
      errorContext.setErrorDialog(loginError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData, loginLoading, loginError]);

  useEffect(() => {
    loadingContext.setLoading(getUserLoading);
    if (getUserData) {
      if (getUserData.findUserById.role === Role.Admin) {
        cookie.set('user', { username: formState.username, userId: userId, role: Role.Admin });
        window.location.href = '/';
      } else {
        cookie.set('user', { username: formState.username, userId: userId, role: Role.User });
        window.location.href = '/';
      }
    }
    if (getUserError) {
      errorContext.setErrorDialog(getUserError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserData, getUserLoading, getUserError]);

  useEffect(() => {
    if (tokenLoaded) {
      getUserByID({ variables: { id: userId } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenLoaded]);

  useEffect(() => {
    setHasErrors(false);
    setErrorMessage('');
  }, [formState]);

  return (
    <Grid container mx="auto" display={'flex'} justifyContent={'center'} alignItems={'center'}>
      <Card
        elevation={10}
        style={{
          paddingTop: '70px',
          paddingBottom: '70px',
          paddingLeft: '33px',
          paddingRight: '33px',
          width: '400px',
          marginTop: '100px'
        }}
      >
        <Grid
          container
          spacing={2}
          className="login"
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Link to="/">
            <img
              style={{ width: 300 }}
              className="login_logo"
              src="https://web.uvic.ca/~virsf/graphics/UVic%20Logo.png"
              alt=""
            />
          </Link>
          <Grid item mb={2}>
            <Typography variant="h3">Sign In</Typography>
          </Grid>
          {hasErrors && (
            <Grid item>
              <Typography variant="body1" color="error">
                {errorMessage}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <TextField
              id="outlined-username-input"
              style={{ width: 300 }}
              label="Username"
              value={formState.username}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  login({ variables: { username: formState.username, password: formState.password } });
                }
              }}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  login({ variables: { username: formState.username, password: formState.password } });
                }
              }}
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
              style={{ width: 300, height: 56 }}
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
      </Card>
    </Grid>
  );
};

export default Login;
