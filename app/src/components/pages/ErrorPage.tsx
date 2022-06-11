import React from 'react';
import ErrorImage from 'images/404.png';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/system/Container';

function ErrorPage() {
  return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center">
        <img src={ErrorImage} alt="404" />
      </Box>
      <Typography variant="h4" align="center">
        This Page is Lost in the Wind
      </Typography>
      <Box display="flex" justifyContent="center">
        <Button variant="text" href="/">
          Back to Home Page
        </Button>
      </Box>
    </Container>
  );
}

export default ErrorPage;
