import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { ThemeProvider } from '@emotion/react';
import appTheme from 'themes/appTheme';
import React from 'react';
import AppRouter from 'router/AppRouter';
import { LoadingContextProvider } from 'contexts/LoadingContext';
import { ErrorContextProvider } from 'contexts/ErrorContext';

function App() {
  return (
    <LoadingContextProvider>
      <ErrorContextProvider>
        <ThemeProvider theme={appTheme}>
          <AppRouter />
        </ThemeProvider>
      </ErrorContextProvider>
    </LoadingContextProvider>
  );
}

export default App;
