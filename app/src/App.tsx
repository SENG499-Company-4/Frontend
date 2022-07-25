
import React from 'react';
import AppRouter from 'router/AppRouter';
import { LoadingContextProvider } from 'contexts/LoadingContext';
import { ErrorContextProvider } from 'contexts/ErrorContext';
import { CssBaseline } from '@mui/material';

import DynamicThemeProvider from 'contexts/DynamicThemeProvider';

function App() {
  return (
    <LoadingContextProvider>
      <ErrorContextProvider>
        <DynamicThemeProvider>
          <CssBaseline />
          <AppRouter />
        </DynamicThemeProvider>
      </ErrorContextProvider>
    </LoadingContextProvider>
  );
}

export default App;
