import { ThemeProvider } from '@emotion/react';
import appTheme from 'themes/appTheme';
import React from 'react';
import AppRouter from 'router/AppRouter';
import { LoadingContextProvider } from 'contexts/LoadingContext';
import { ErrorContextProvider } from 'contexts/ErrorContext';
import { TermSelectorContextProvider } from 'contexts/TermSelectorContext';
import { CssBaseline } from '@mui/material';
import DynamicThemeProvider from 'contexts/DynamicThemeProvider';

function App() {
  return (
    <DynamicThemeProvider>
      <CssBaseline />
      <LoadingContextProvider>
        <ErrorContextProvider>
          <TermSelectorContextProvider>
            <AppRouter />
          </TermSelectorContextProvider>
        </ErrorContextProvider>
      </LoadingContextProvider>
    </DynamicThemeProvider>
  );
}

export default App;
