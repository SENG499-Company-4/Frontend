import { ThemeProvider } from '@emotion/react';
import appTheme from 'themes/appTheme';
import React from 'react';
import AppRouter from 'AppRouter';

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
