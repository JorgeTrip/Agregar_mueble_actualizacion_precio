import React, { useState } from 'react';
import { Container, Typography, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import FileProcessor from './components/FileProcessor';
import Sidebar from './components/Sidebar';
import CashAssistant from './components/CashAssistant';
import ClosureChecklist from './components/ClosureChecklist';

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
  const [selectedComponent, setSelectedComponent] = useState('home');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar onSelect={setSelectedComponent} />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: theme.palette.background.default,
            flexGrow: 1,
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {selectedComponent === 'home' && (
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
                  Procesador de lista de Precios con Muebles
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#f48fb1',
                    fontStyle: 'italic',
                    letterSpacing: '0.1em',
                    mt: 1,
                  }}
                >
                  By J.O.T.
                </Typography>
                <FileProcessor />
              </Box>
            )}
            {selectedComponent === 'cashAssistant' && <CashAssistant />}
            {selectedComponent === 'checklist' && <ClosureChecklist />}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
