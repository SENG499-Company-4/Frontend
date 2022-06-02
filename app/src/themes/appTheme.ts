import { Theme, ThemeOptions, createTheme } from '@mui/material';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#3f80b5'
    },
    secondary: {
      main: '#f50057'
    }
  }
};

const appTheme: Theme = createTheme(themeOptions);

export default appTheme;
