import React from 'react';
import ErrorImage from 'images/404.png';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/system/Container';
import { useNavigate } from 'react-router-dom';

interface IErrorPageProps {
  message?: string;
  code?: string;
}

function ErrorPage(props: IErrorPageProps) {
  const errorTitle = props.code ? 'Error ' + props.code + '' : 'Unknown Error';
  const errorText = props.message
    ? props.message
    : 'The application encountered an unknown error processing your request.';

  const navigate = useNavigate();
  return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center">
        <img src={ErrorImage} alt="404" />
      </Box>
      <Typography variant="h3" align="center">
        {errorTitle}
      </Typography>
      <Typography variant="h5" align="center" marginTop={2}>
        {errorText}
      </Typography>
      <Box display="flex" justifyContent="center" marginTop={6}>
        <Button variant="text" onClick={() => navigate('/')} size={'large'}>
          Back to Home Page
        </Button>
      </Box>
    </Container>
  );
}

export default ErrorPage;
