import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

function Home() {
  return (
    <Grid container spacing={2} alignItems={'center'} marginTop={6} direction={'column'}>
      <Grid item>
        <Typography variant="h4">UVIC Scheduler</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">Pretend this is a cool flashy splash page.</Typography>
      </Grid>
    </Grid>
  );
}

export default Home;
