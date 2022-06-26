import { CircularProgress } from '@mui/material';
import React from 'react';

function LoadingSpinner() {
  return (
  <div style={{
      marginTop: '20%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  }}>
    <CircularProgress size={60} thickness={4} color="primary" />
  </div>
  );
}

export default LoadingSpinner;
