import React, { useState } from 'react';
import { Container, Typography, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import FileProcessor from './components/FileProcessor';
import Sidebar from './components/Sidebar';
import CashAssistant from './components/CashAssistant';
import ClosureChecklist from './components/ClosureChecklist';
import DosageCalculator from './components/DosageCalculator';

// Componente principal de la aplicación que integra todas las herramientas para farmacia
// Utiliza Material-UI para el diseño y gestiona la navegación entre componentes

// Configuración del tema oscuro personalizado para toda la aplicación
// Define colores, estilos de componentes y otras propiedades visuales
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
  // Estado para controlar qué componente se muestra actualmente en la interfaz
  const [selectedComponent, setSelectedComponent] = useState('home');

  return (
    // Aplicación del tema personalizado a toda la aplicación
    <ThemeProvider theme={theme}>
      {/* Normalización de estilos CSS para consistencia entre navegadores */}
      <CssBaseline />
      {/* Contenedor principal con estructura flexible */}
      <Box sx={{ display: 'flex' }}>
        {/* Barra lateral de navegación que recibe la función para cambiar de componente */}
        <Sidebar onSelect={setSelectedComponent} />
        {/* Área principal de contenido */}
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
          {/* Contenedor principal para todos los componentes */}
          <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Componente de inicio - Procesador de archivos */}
            {/* Se muestra solo cuando selectedComponent es 'home' */}
            <Box sx={{ 
              display: selectedComponent === 'home' ? 'block' : 'none',
              textAlign: 'center', 
              mb: 4, 
              mt: 4 
            }}>
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
                  mb: 4,
                }}
              >
                By J.O.T.
              </Typography>
              <FileProcessor />
            </Box>
            
            {/* Asistente de Caja - Componente para gestionar operaciones de caja */}
            {/* Siempre está montado pero solo se muestra cuando selectedComponent es 'cashAssistant' */}
            <Box sx={{ display: selectedComponent === 'cashAssistant' ? 'block' : 'none', width: '100%' }}>
              <CashAssistant />
            </Box>
            
            {/* Lista de Verificación de Cierre - Componente para gestionar tareas de cierre */}
            {/* Siempre está montado pero solo se muestra cuando selectedComponent es 'checklist' */}
            <Box sx={{ display: selectedComponent === 'checklist' ? 'block' : 'none', width: '100%' }}>
              <ClosureChecklist />
            </Box>
            
            {/* Calculadora de Dosificación - Componente para calcular dosis de medicamentos */}
            {/* Siempre está montado pero solo se muestra cuando selectedComponent es 'dosageCalculator' */}
            <Box sx={{ display: selectedComponent === 'dosageCalculator' ? 'block' : 'none', width: '100%' }}>
              <DosageCalculator />
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
