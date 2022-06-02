import { ThemeProvider } from '@emotion/react';
import appTheme from 'themes/appTheme';
import { Button, Card, Typography } from '@mui/material';
import React from 'react';

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      {/* This is our main app tree. All nested components in this tree will inherit properties from those above it. Our router should be the root of this tree. */}
      <Card>
        {/* This card can go away when we have a router */}
        <Typography variant="h4">Hello from a MUI card.</Typography>
        <Button color="primary" variant="contained">
          Primary Color Button
        </Button>
        <Button color="secondary" variant="contained">
          Secondary Color Button
        </Button>
      </Card>
    </ThemeProvider>
  );
}

export default App;
