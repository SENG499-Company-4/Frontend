import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Grid, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Faculty } from 'constants/timetable.constants';
import { CREATE_USER } from 'api/Mutations';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { useMutation } from '@apollo/client';

interface IRegisterForm {
  username: string;
  faculty: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [formData, setFormData] = useState<IRegisterForm>({
    username: '',
    faculty: '',
    password: '',
    confirmPassword: ''
  });
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);

  const [createUser, { loading, data, error }] = useMutation(CREATE_USER);

  useEffect(() => {
    loadingContext.setLoading(loading);
    if (data) {
      console.log('Data returned from create user: ', data);
      // const createUserResponse = data.createUser;
      // if (createUserResponse.success) {
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data, error]);

  const createAccount = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Create POST request here
    // Before we implement createUser, need to check with backend on what the payload should be
  };

  useEffect(() => {
    (formData.password === formData.confirmPassword && formData.password.length > 0) || formData.faculty.length === 0
      ? setHasErrors(false)
      : setHasErrors(true);
  }, [formData.password, formData.confirmPassword, formData.faculty]);

  const faculties: Faculty[] = ['CSC', 'SENG', 'ECE'];
  const handleChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, faculty: event.target.value });
  };

  return (
    <Box
      component="form"
      sx={{
        width: 300
      }}
      m="auto"
      justifyContent="center"
      autoComplete="off"
    >
      <Grid container spacing={2} marginTop={2}>
        <Grid item>
          <Typography variant="h4">Create an Account</Typography>
        </Grid>
        {hasErrors && (
          <Grid item>
            <Typography variant="body1" color="error">
              Passwords do not match.
            </Typography>
          </Grid>
        )}
        <Grid item>
          <TextField
            id="outlined-required"
            label="UVic Username"
            placeholder="JJohnson"
            style={{ width: 300 }}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </Grid>
        <Grid item>
          <FormControl fullWidth>
            <InputLabel id="select-label">Faculty</InputLabel>
            <Select
              labelId="select-label"
              id="outlined-faculty"
              label="Faculty"
              style={{ width: 300 }}
              onChange={handleChange}
            >
              <MenuItem value={faculties[0]}>CSC</MenuItem>
              <MenuItem value={faculties[1]}>SENG</MenuItem>
              <MenuItem value={faculties[2]}>ECE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            style={{ width: 300 }}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </Grid>
        <Grid item>
          <TextField
            id="outlined-password-input"
            error={hasErrors}
            label="Verify Password"
            type="password"
            style={{ width: 300 }}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" disabled={hasErrors} style={{ width: 300 }} onClick={createAccount}>
            Create a Scheduler account
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Register;
