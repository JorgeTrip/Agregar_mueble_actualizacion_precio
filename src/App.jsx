import React, { useState, useMemo } from 'react';
import { Container, Typography, CssBaseline, ThemeProvider, createTheme, Box, AppBar, Toolbar } from '@mui/material';
import FileProcessor from './components/FileProcessor';
import Sidebar from './components/Sidebar';
import CashAssistant from './components/CashAssistant';
import ClosureChecklist from './components/ClosureChecklist';
import DosageCalculator from './components/DosageCalculator';
import MedicationPrices from './components/MedicationPrices';
import ArgentinaVademecum from './components/ArgentinaVademecum';

// Componente principal de la aplicación que integra todas las herramientas para farmacia
// Utiliza Material-UI para el diseño y gestiona la navegación entre componentes

// Función para crear el tema según el modo seleccionado (claro u oscuro)
const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#90caf9' : '#1976d2',
    },
    secondary: {
      main: mode === 'dark' ? '#f48fb1' : '#e91e63',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f5f5',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      appContainer: mode === 'dark' ? '#1a1a1a' : '#ffffff', // Fondo para el contenedor de la app
      outsideApp: mode === 'dark' ? '#0a0a0a' : '#e0e0e0', // Fondo para el área fuera de la app
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: mode === 'dark' ? '#333' : '#e0e0e0',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
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
  // Estado para controlar el tema actual (oscuro o claro)
  const [themeMode, setThemeMode] = useState('dark');
  
  // Crear el tema basado en el modo seleccionado
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);
  
  // Función para alternar entre temas
  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  return (
    // Aplicación del tema personalizado a toda la aplicación
    <ThemeProvider theme={theme}>
      {/* Normalización de estilos CSS para consistencia entre navegadores */}
      <CssBaseline />
      {/* Fondo para toda la aplicación */}
      <Box sx={{ 
        backgroundColor: theme.palette.background.outsideApp,
        minHeight: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
      }} />
      {/* Contenedor principal que mantiene todo centrado */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '1000px', 
        margin: '0 auto', 
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Navbar superior fijo */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            width: '100%',
            maxWidth: '1000px',
            left: '50%',
            transform: 'translateX(-50%)',
            '@media (min-width: 1000px)': {
              left: 'auto',
              transform: 'none',
              right: 'auto'
            },
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'linear-gradient(90deg, rgba(30,30,30,1) 0%, rgba(50,50,50,1) 100%)'
              : 'linear-gradient(90deg, rgba(240,240,255,1) 0%, rgba(220,230,255,1) 100%)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 4px 12px rgba(0,0,0,0.4)'
              : '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Toolbar sx={{ height: '72px', borderRadius: '8px' }}>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between', // Espacia los elementos entre ellos
      flexGrow: 1,
      transition: 'all 0.3s ease',
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography
        variant="h5"
        component="div"
        sx={{
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
            : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: (theme) => theme.palette.mode === 'dark'
            ? '0px 2px 4px rgba(0,0,0,0.5)'
            : '0px 2px 4px rgba(0,0,0,0.2)',
          fontSize: { xs: '1.8rem', sm: '2rem' },
          mr: 1,
          display: 'inline-block',
          transform: 'translateZ(0)',
          lineHeight: 1,
          '&:hover': {
            transform: 'scale(1.02) translateZ(0)',
          },
        }}
      >
        FarmaKit
      </Typography>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{
          color: (theme) => theme.palette.mode === 'dark' ? '#f48fb1' : '#e91e63',
          fontStyle: 'italic',
          opacity: 0.9,
          fontSize: { xs: '0.9rem', sm: '1rem' },
          display: 'block',
          lineHeight: 1,
        }}
      >
        Herramientas de farmacia
      </Typography>
    </Box>
    <Typography
      variant="subtitle1" // Usamos la misma variante para el estilo
      component="div"
      sx={{
        color: (theme) => theme.palette.mode === 'dark' ? '#f48fb1' : '#e91e63',
        fontStyle: 'italic',
        opacity: 0.9,
        fontSize: { xs: '0.9rem', sm: '1rem' },
        lineHeight: 1,
      }}
    >
      by J.O.T.
    </Typography>
  </Box>
</Toolbar>
        </AppBar>
        {/* Contenedor principal con estructura flexible */}
        <Box 
          sx={{ 
            display: 'flex', 
            pt: '64px',
            backgroundColor: theme.palette.background.appContainer, // Fondo distintivo para el área de la app
            boxShadow: '0 0 10px rgba(0,0,0,0.2)', // Sombra sutil para distinguir del fondo
            minHeight: '100vh', // Altura mínima para que ocupe toda la pantalla
            width: '100%',
            flexGrow: 1
          }}
        > {/* Añadir padding-top para compensar el navbar fijo */}
        {/* Barra lateral de navegación que recibe la función para cambiar de componente y controlar el tema */}
        <Sidebar 
          onSelect={setSelectedComponent} 
          toggleTheme={toggleTheme} 
          themeMode={themeMode} 
        />
        {/* Área principal de contenido */}
        <Box
          sx={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex', // con flex, el contenedor ocupa todo el ancho disponible
            flexDirection: 'column', // con column, los elementos se apilan verticalmente
            alignItems: 'center', // con center, los elementos se centran horizontalmente
            backgroundColor: theme.palette.background.appContainer, // Fondo distintivo para el área de la app
            flexGrow: 1, // el contenedor ocupa todo el ancho disponible
            marginTop: 0, // Eliminar margen superior ya que se aplicó padding-top al contenedor padre
            marginLeft: { xs: 0, sm: '60px' }, // Margen izquierdo para compensar el sidebar en desktop
            paddingBottom: { xs: '60px', sm: 0 }, // Padding inferior para compensar el navbar móvil
            width: { xs: '100%', sm: 'calc(100% - 60px)' }, // Ancho ajustado para compensar el sidebar
            position: 'relative'
          }}
        >
          {/* Contenedor principal para todos los componentes */}
          <Container
            maxWidth={false}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              minWidth: '1000px',
              padding: { xs: '0 16px', sm: '0 24px' },
              boxSizing: 'border-box',
              margin: '0 auto',
              overflow: 'hidden', // Evita que el contenido desborde
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
            
            {/* Precios de Medicamentos - Componente para consultar precios de medicamentos */}
            {/* Siempre está montado pero solo se muestra cuando selectedComponent es 'medicationPrices' */}
            <Box sx={{ display: selectedComponent === 'medicationPrices' ? 'block' : 'none', width: '100%' }}>
              <MedicationPrices />
            </Box>
            
            {/* Vademecum de Argentina - Componente para consultar el vademecum de medicamentos */}
            {/* Siempre está montado pero solo se muestra cuando selectedComponent es 'argentinaVademecum' */}
            <Box sx={{ display: selectedComponent === 'argentinaVademecum' ? 'block' : 'none', width: '100%' }}>
              <ArgentinaVademecum />
            </Box>
          </Container>
        </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
