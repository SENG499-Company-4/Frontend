import { Theme, ThemeOptions, createTheme } from '@mui/material';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#3f80b5'
    },
    secondary: {
      main: '#f50057'
    }
    // text: {
    //   primary: '#000',
    //   secondary: '#444'
    // }
  }
};

const appTheme: Theme = createTheme(themeOptions);

export default appTheme;
