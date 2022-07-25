import { ThemeProvider } from '@emotion/react';
import appTheme from 'themes/appTheme';
import React from 'react';
import AppRouter from 'router/AppRouter';
import { LoadingContextProvider } from 'contexts/LoadingContext';
import { ErrorContextProvider } from 'contexts/ErrorContext';
import { TermSelectorContextProvider } from 'contexts/TermSelectorContext';

function App() {
  return (
    <LoadingContextProvider>
      <ErrorContextProvider>
        <ThemeProvider theme={appTheme}>
          <TermSelectorContextProvider>
            <AppRouter />
          </TermSelectorContextProvider>
        </ThemeProvider>
      </ErrorContextProvider>
    </LoadingContextProvider>
  );
}

export default App;
