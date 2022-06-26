import { Backdrop, CircularProgress } from '@mui/material';
import React, { ReactElement } from 'react';

interface LoadingSpinnerProps {
  isLoading: boolean;
}

function LoadingSpinner(props: LoadingSpinnerProps): ReactElement<LoadingSpinnerProps> {
  return (
    <div>
      <Backdrop open={props.isLoading} sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}>
        <CircularProgress size={60} thickness={4} color="inherit" />
      </Backdrop>
    </div>
  );
}

export default LoadingSpinner;
