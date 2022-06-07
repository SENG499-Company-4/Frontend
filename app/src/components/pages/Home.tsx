import React from 'react';
import uviclogo from 'images/uviclogo.png';
import { Typography } from '@mui/material';
import { Divider, Grid } from '@mui/material';
import { Container } from '@mui/system';
import { Box } from '@mui/system';
import { Button } from '@mui/material';

function Home() {
  return (
    <Container>
      <Grid container paddingTop={4} spacing={2} direction={'row'}>
        <Grid item>
          <img src={uviclogo} alt="uviclogo" width={150}></img>
        </Grid>

        <Grid item marginTop={1} marginLeft={23}>
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
