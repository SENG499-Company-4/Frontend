import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Grid, Typography } from '@mui/material';

interface IRegisterForm {
  username: string;
  vnum: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [formData, setFormData] = useState<IRegisterForm>({
    username: '',
    vnum: '',
    password: '',
    confirmPassword: ''
  });

  const createAccount = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Create POST request here
  };

  useEffect(() => {
    (formData.password === formData.confirmPassword && formData.password.length > 0) || formData.vnum.length === 0
      ? setHasErrors(false)
      : setHasErrors(true);
  }, [formData.password, formData.confirmPassword, formData.vnum.length]);

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
          <TextField
            id="outlined-required"
            label="UVic ID"
            placeholder="V00123456"
            style={{ width: 300 }}
            value={formData.vnum}
            onChange={(e) => setFormData({ ...formData, vnum: e.target.value })}
          />
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
