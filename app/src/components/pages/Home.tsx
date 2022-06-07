import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function Home() {

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/login`;
    navigate(path);
  }

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      p: 1,
      m: 1,
      bgcolor: 'background.paper',
      height: 1,
      width: 1,
      borderRadius: 1,
    }}>
      <Button variant='outlined' style={{ width: '30%', height: 50 }} onClick={routeChange}>Login Now</Button>
    </Box >
  )
}

export default Home;
