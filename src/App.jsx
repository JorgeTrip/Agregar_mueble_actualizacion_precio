import { Container, Typography, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import FileProcessor from './components/FileProcessor';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#333',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#2d2d2d',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          padding: '8px 16px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4, mt: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                color: '#90caf9',
                fontWeight: 'bold',
              }}
            >
              Procesador de Precios con Muebles
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#f48fb1',
                fontStyle: 'italic',
                letterSpacing: '0.1em',
                mt: 1
              }}
            >
              By J.O.T.
            </Typography>
          </Box>
          <FileProcessor />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
