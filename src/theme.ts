import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#2579f2',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#627383',
      main: '#192A43',
      dark: '#000',
      contrastText: '#000',
    },
  },
  shape: {
    borderRadius: 3,
  },
});

export default theme;
