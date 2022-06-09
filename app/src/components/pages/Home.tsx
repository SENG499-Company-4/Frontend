import React from 'react';
import uviclogo from 'images/uviclogo.png';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Container from '@mui/system/Container';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';

function Home() {
  return (
    <Container>
      <Grid container paddingTop={4} spacing={25} direction={'row'}>
        <Grid item>
          <img src={uviclogo} alt="uviclogo" width={150}></img>
        </Grid>

        <Grid item marginTop={1}>
          <Typography variant="h4">University Scheduler System</Typography>
        </Grid>
      </Grid>

      <Divider></Divider>

      <Box display="flex" justifyContent="center" marginTop={20}>
        Hello World !!
      </Box>
      <Box display="flex" justifyContent="center" marginTop={5}>
        This is the Home page of our University Scheduler System.
      </Box>

      <Box display="flex" justifyContent="center" marginTop={10}>
        <Button variant="contained" href="/login">
          Log in
        </Button>
      </Box>
    </Container>
  );
}

export default Home;
