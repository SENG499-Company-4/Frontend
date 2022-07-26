import { createTheme, PaletteMode, ThemeOptions, ThemeProvider } from '@mui/material';
import React from 'react';
import Themes from 'devextreme/ui/themes';

interface IThemeContext {
  themeType: boolean;
  setThemeType: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ThemeContext = React.createContext<IThemeContext>({
  themeType: false,
  setThemeType: () => {}
});

function DynamicThemeProvider(props: any) {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [themeType, setThemeType] = React.useState(false);

  React.useEffect(() => {
    if (!themeType) {
      setMode('light');
      Themes.current('generic.light');
    } else {
      setMode('dark');
      Themes.current('generic.dark');
    }
  }, [themeType]);

  const getTheme = (mode: PaletteMode) => {
    return {
      palette: {
        mode: mode,
        primary: {
          main: '#3f80b5'
        },
        secondary: {
          main: '#f50057'
        }
      }
    };
  };

  const theme = React.useMemo(() => createTheme(getTheme(mode) as ThemeOptions), [mode]);
  return (
    <ThemeContext.Provider value={{ themeType, setThemeType }}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default DynamicThemeProvider;
