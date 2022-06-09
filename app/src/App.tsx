import { ThemeProvider } from '@emotion/react';
import appTheme from 'themes/appTheme';
import React from 'react';
import AppRouter from 'AppRouter';
import { LoadingContextProvider } from 'contexts/LoadingContext';

function App() {
  return (
    <LoadingContextProvider>
      <ThemeProvider theme={appTheme}>
        <AppRouter />
      </ThemeProvider>
    </LoadingContextProvider>
  );
}

export default App;
