import React from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function Home() {
  let navigate: NavigateFunction = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        height: 1,
        width: 1,
        borderRadius: 1
      }}
    >
      <Button variant="outlined" style={{ width: '30%', height: 50 }} onClick={() => navigate(`/login`)}>
        Login Now
      </Button>
    </Box>
  );
}

export default Home;
