import { CircularProgress } from '@mui/material';
import React from 'react';

function LoadingSpinner() {
  return <CircularProgress size={60} thickness={4} color="primary" />;
}

export default LoadingSpinner;
